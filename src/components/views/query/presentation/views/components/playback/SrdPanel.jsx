import React, { useState, useEffect, useRef } from 'react';
import { createPluginWithFallback } from '../../../../../../../components/plugins/registry/pluginFactory';
import { initializePlugins, loadPluginByClassName } from '../../../../../../../components/plugins/registry/pluginLoader';
import { getAllPluginsForType, registerPlugin } from '../../../../../../../components/plugins/registry/pluginRegistry';
import DefaultSrdPlugin from '../../../../../../../components/plugins/srd/DefaultSrdPlugin';

/**
 * Component for Structured Related Data Panel
 */
function SrdPanel({ mmfgid, manifestData, zipContents }) {
  const [pluginContent, setPluginContent] = useState(null);
  const [srdEntry, setSrdEntry] = useState(null);
  const [availablePlugins, setAvailablePlugins] = useState(['default']);
  const [activePlugin, setActivePlugin] = useState('default');
  const [pluginsInitialized, setPluginsInitialized] = useState(false);
  const pluginsLoaded = useRef(false);
  
  // Initialize plugins on first render
  useEffect(() => {
    // Only run initialization once
    if (!pluginsLoaded.current) {
      pluginsLoaded.current = true;
      console.log('SRD Panel: Initializing plugins');
      
      // Register default plugin first
      registerPlugin('SRD', 'default', DefaultSrdPlugin);
      
      // Initialize all configured plugins
      initializePlugins();
      
      // Use the plugin registry and loader instead of static imports
      // The plugins should be loaded by the application initialization code
      
      setTimeout(() => {
        // Get all available SRD plugins after loading
        const srdPlugins = getAllPluginsForType('SRD');
        const pluginTypes = Object.keys(srdPlugins);
        
        if (pluginTypes.length > 0) {
          setAvailablePlugins(['default', ...pluginTypes.filter(type => type !== 'default')]);
        } else {
          setAvailablePlugins(['default']);
        }
        
        setPluginsInitialized(true);
        console.log('SRD Panel: Plugins initialized');
      }, 100); // Small delay to ensure plugins are registered
    }
  }, []);
  
  useEffect(() => {
    if (manifestData && Array.isArray(manifestData.files)) {
      // Find SRD entry in manifest
      const srdEntry = manifestData.files.find(entry => entry.type === 'SRD');
      
      if (srdEntry) {
        console.log('SRD Panel can show:', srdEntry);
        console.log('SRD file path:', srdEntry.path);
        console.log('SRD mimetype:', srdEntry.mimetype);
        console.log('SRD content type:', srdEntry.contenttype);
        
        setSrdEntry(srdEntry);

        // If we have the content in zipContents, we could use it directly
        if (zipContents && zipContents[srdEntry.path]) {
          console.log('SRD content available in zipContents');
          setPluginContent(zipContents[srdEntry.path]);
          
          // Try to dynamically load a plugin based on the content type
          if (srdEntry.contenttype) {
            // Convert content type to potential class name (e.g., 'rsg' -> 'RsgPlugin')
            const className = srdEntry.contenttype.charAt(0).toUpperCase() + srdEntry.contenttype.slice(1) + 'Plugin';
            console.log('SRD Panel: Attempting to load plugin:', className);
            
            // Set the active plugin to match the content type
            setActivePlugin(srdEntry.contenttype.toLowerCase());
            
            // Attempt to load the plugin dynamically and update available plugins
            loadPluginByClassName('SRD', className)
              .then(() => {
                // Update available plugins after successful loading
                const srdPlugins = getAllPluginsForType('SRD');
                const pluginTypes = Object.keys(srdPlugins);
                
                if (pluginTypes.length > 0) {
                  setAvailablePlugins(['default', ...pluginTypes.filter(type => type !== 'default')]);
                }
                console.log('SRD Panel: Plugin loaded successfully:', className);
              })
              .catch(err => {
                console.warn(`Could not load plugin ${className}, using default:`, err);
              });
          }
        }
      } else {
        console.log('No SRD entry found in manifest');
      }
    } else if (manifestData) {
      console.log('SRD Panel: manifestData is not an array:', manifestData);
    }
  }, [manifestData, zipContents]);
  return (
    <div className="card mt-3">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h6 className="mb-0">SRD Data</h6>
        
        {srdEntry && availablePlugins.length > 1 && (
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
        {srdEntry && (
          <div className="tab-content">
            {activePlugin === 'default' ? (
              <DefaultSrdPlugin 
                data={pluginContent} 
                mmfgid={mmfgid} 
                fileInfo={srdEntry} 
              />
            ) : (
              createPluginWithFallback(
                'SRD', 
                activePlugin, 
                { 
                  data: pluginContent, 
                  mmfgid, 
                  fileInfo: srdEntry 
                },
                DefaultSrdPlugin
              ) || (
                <div className="alert alert-warning">
                  <i className="fa fa-exclamation-triangle me-2"></i>
                  Plugin not found for content type: {activePlugin}
                </div>
              )
            )}
          </div>
        )}
        
        {!srdEntry && (
          <div className="alert alert-secondary">
            <i className="fa fa-info-circle me-2"></i>
            No SRD data available
          </div>
        )}
      </div>
    </div>
  );
}

export default SrdPanel;
