import React, { useState, useEffect, useRef } from 'react';
import { createPluginWithFallback } from '../../../../../../../components/plugins/registry/pluginFactory';
import { initializePlugins, loadPluginByClassName } from '../../../../../../../components/plugins/registry/pluginLoader';
import { getAllPluginsForType, registerPlugin } from '../../../../../../../components/plugins/registry/pluginRegistry';
import DefaultMmcoPlugin from '../../../../../../../components/plugins/mmco/DefaultMmcoPlugin';

/**
 * Component for MMCO (Multimedia Content Object) playback panel
 */
function MmcoPanel({ playerRef, mmfgid, manifestData, zipContents }) {
  const [pluginContent, setPluginContent] = useState(null);
  const [mmcoEntry, setMmcoEntry] = useState(null);
  const [availablePlugins, setAvailablePlugins] = useState(['default']);
  const [activePlugin, setActivePlugin] = useState('default');
  const [pluginsInitialized, setPluginsInitialized] = useState(false);
  const pluginsLoaded = useRef(false);
  
  // Initialize plugins on first render
  useEffect(() => {
    // Only run initialization once
    if (!pluginsLoaded.current) {
      pluginsLoaded.current = true;
      
      // Register default plugin first
      registerPlugin('MMCO', 'default', DefaultMmcoPlugin);
      
      // Initialize all configured plugins
      initializePlugins();
      
      setTimeout(() => {
        // Get all available MMCO plugins after loading
        const mmcoPlugins = getAllPluginsForType('MMCO');
        const pluginTypes = Object.keys(mmcoPlugins);
        
        if (pluginTypes.length > 0) {
          setAvailablePlugins(['default', ...pluginTypes.filter(type => type !== 'default')]);
        } else {
          setAvailablePlugins(['default']);
        }
        
        setPluginsInitialized(true);
      }, 100); // Small delay to ensure plugins are registered
    }
  }, []);
  
  useEffect(() => {
    if (manifestData && Array.isArray(manifestData.files)) {
      // Find MMCO entry in manifest
      const entry = manifestData.files.find(entry => entry.type === 'MMCO');
      
      if (entry) {
        console.log('MMCO Panel can show:', entry);
        console.log('MMCO file path:', entry.path);
        console.log('MMCO mimetype:', entry.mimetype);
        console.log('MMCO content type:', entry.content);
        
        setMmcoEntry(entry);
        
        // If we have the content in zipContents, load the appropriate plugin
        if (zipContents && zipContents[entry.path]) {
          console.log('MMCO content available in zipContents');
          console.log('MMCO content type:', typeof zipContents[entry.path]);
          console.log('MMCO content instanceof ArrayBuffer:', zipContents[entry.path] instanceof ArrayBuffer);
          console.log('MMCO content instanceof Uint8Array:', zipContents[entry.path] instanceof Uint8Array);
          
          // Store the content for the plugin
          setPluginContent(zipContents[entry.path]);
          
          // Try to dynamically load a plugin based on the content type
          if (entry.content) {
            // Convert content type to potential class name (e.g., 'video' -> 'VideoPlugin')
            const className = entry.content.charAt(0).toUpperCase() + entry.content.slice(1) + 'Plugin';
            
            // Set the active plugin to match the content type
            setActivePlugin(entry.content.toLowerCase());
            
            // Attempt to load the plugin dynamically and update available plugins
            loadPluginByClassName('MMCO', className)
              .then(() => {
                // Update available plugins after successful loading
                const mmcoPlugins = getAllPluginsForType('MMCO');
                const pluginTypes = Object.keys(mmcoPlugins);
                
                if (pluginTypes.length > 0) {
                  setAvailablePlugins(['default', ...pluginTypes.filter(type => type !== 'default')]);
                }
              })
              .catch(err => {
                console.warn(`Could not load plugin ${className}, using default:`, err);
              });
          }
        }
      } else {
        console.log('No MMCO entry found in manifest');
      }
    } else if (manifestData) {
      console.log('MMCO Panel: manifestData is not an array:', manifestData);
    }
  }, [manifestData, zipContents]);
  return (
    <div className="card mt-3">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Multimedia Content</h6>
        
        {mmcoEntry && availablePlugins.length > 1 && (
          <div className="btn-group btn-group-sm" role="group">
            {availablePlugins.map(plugin => (
              <button 
                key={plugin} 
                type="button" 
                className={`btn ${activePlugin === plugin ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setActivePlugin(plugin)}
              >
                {plugin.charAt(0).toUpperCase() + plugin.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="card-body">
        {mmcoEntry && (
          <div className="tab-content">
            {activePlugin === 'default' ? (
              <DefaultMmcoPlugin 
                data={pluginContent} 
                mmfgid={mmfgid} 
                fileInfo={mmcoEntry} 
              />
            ) : (
              createPluginWithFallback(
                'MMCO', 
                activePlugin, 
                { 
                  data: pluginContent, 
                  mmfgid, 
                  fileInfo: mmcoEntry 
                },
                DefaultMmcoPlugin
              )
            )}
          </div>
        )}
        
        {!mmcoEntry && (
          <div className="alert alert-secondary">
            <i className="fa fa-info-circle me-2"></i>
            No multimedia content available
          </div>
        )}
      </div>
    </div>
  );
}

export default MmcoPanel;
