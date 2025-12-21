import React, { useState, useEffect, useRef } from 'react';
import { createPluginWithFallback } from '../../../../../../../components/plugins/registry/pluginFactory';
import { initializePlugins, loadPluginByClassName } from '../../../../../../../components/plugins/registry/pluginLoader';
import { getAllPluginsForType, registerPlugin } from '../../../../../../../components/plugins/registry/pluginRegistry';
import DefaultPdPlugin from '../../../../../../../components/plugins/pd/DefaultPdPlugin';

/**
 * Component for Peripheral Data Panel
 */
function PdPanel({ mmfgid, manifestData, zipContents }) {
  const [pluginContent, setPluginContent] = useState(null);
  const [pdEntry, setPdEntry] = useState(null);
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
      registerPlugin('PD', 'default', DefaultPdPlugin);
      
      // Initialize all configured plugins
      initializePlugins();
      
      // Use the plugin registry and loader instead of static imports
      // The plugins should be loaded by the application initialization code
      
      setTimeout(() => {
        // Get all available PD plugins after loading
        const pdPlugins = getAllPluginsForType('PD');
        const pluginTypes = Object.keys(pdPlugins);
        
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
      // Find PD entry in manifest
      const entry = manifestData.files.find(entry => entry.type === 'PD');
      
      if (entry) {
        console.log('PD Panel can show:', entry);
        console.log('PD file path:', entry.path);
        console.log('PD mimetype:', entry.mimetype);
        console.log('PD content type:', entry.content);
        
        setPdEntry(entry);
        
        // If we have the content in zipContents, load the appropriate plugin
        if (zipContents && zipContents[entry.path]) {
          console.log('PD content available in zipContents');
          setPluginContent(zipContents[entry.path]);
          
          // Try to dynamically load a plugin based on the content type
          if (entry.content) {
            // Convert content type to potential class name (e.g., 'heartrate' -> 'HeartratePlugin')
            const className = entry.content.charAt(0).toUpperCase() + entry.content.slice(1) + 'Plugin';
            
            // Set the active plugin to match the content type
            setActivePlugin(entry.content.toLowerCase());
            
            // Attempt to load the plugin dynamically and update available plugins
            loadPluginByClassName('PD', className)
              .then(() => {
                // Update available plugins after successful loading
                const pdPlugins = getAllPluginsForType('PD');
                const pluginTypes = Object.keys(pdPlugins);
                
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
        console.log('No PD entry found in manifest');
      }
    } else if (manifestData) {
      console.log('PD Panel: manifestData is not an array:', manifestData);
    }
  }, [manifestData, zipContents]);
  
  return (
    <div className="card mt-3">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Peripheral Data</h6>
        
        {pdEntry && availablePlugins.length > 1 && (
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
        {pdEntry && (
          <div className="tab-content">
            {activePlugin === 'default' ? (
              <DefaultPdPlugin 
                data={pluginContent} 
                mmfgid={mmfgid} 
                fileInfo={pdEntry} 
              />
            ) : (
              createPluginWithFallback(
                'PD', 
                activePlugin, 
                { 
                  data: pluginContent, 
                  mmfgid, 
                  fileInfo: pdEntry 
                },
                DefaultPdPlugin
              )
            )}
          </div>
        )}
        
        {!pdEntry && (
          <div className="alert alert-secondary">
            <i className="fa fa-info-circle me-2"></i>
            No peripheral data available
          </div>
        )}
      </div>
    </div>
  );
}

export default PdPanel;
