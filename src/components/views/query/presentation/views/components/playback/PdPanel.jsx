import React, { useState, useEffect, useRef } from 'react';
import { createPluginWithFallback } from '../../../../../../../components/plugins/registry/pluginFactory';
import { initializePlugins, loadPluginByClassName } from '../../../../../../../components/plugins/registry/pluginLoader';
import { getAllPluginsForType, registerPlugin } from '../../../../../../../components/plugins/registry/pluginRegistry';
import DefaultPdPlugin from '../../../../../../../components/plugins/pd/DefaultPdPlugin';
import config from '../../../../../../../config/config';

/**
 * Component for Peripheral Data Panel
 */
function PdPanel({ mmfgid, manifestData, zipContents }) {
  const [pdEntries, setPdEntries] = useState([]);
  const [activeFileTab, setActiveFileTab] = useState(0);
  const [pluginsInitialized, setPluginsInitialized] = useState(false);
  const [loadedPluginTypes, setLoadedPluginTypes] = useState({});
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
      
      setPluginsInitialized(true);
    }
  }, []);
  
  useEffect(() => {
    if (!manifestData || !Array.isArray(manifestData.files)) {
      if (manifestData) {
        console.log('PD Panel: manifestData is not an array:', manifestData);
      }
      return;
    }
    
    const entries = manifestData.files.filter(entry => entry.type === 'PD');
    
    if (entries.length === 0) {
      console.log('No PD entries found in manifest');
      setPdEntries([]);
      return;
    }
    
    console.log(`PD Panel found ${entries.length} PD file(s)`);
    
    const enrichedEntries = entries.map((entry, index) => {
      const content = zipContents && zipContents[entry.path] ? zipContents[entry.path] : null;
      
      console.log('PD file:', entry.path, 'content type:', entry.contenttype, 'has content:', !!content);
      
      const defaultPluginType = 'default';
      
      // Load plugin based on content type, even if content isn't loaded yet
      if (entry.contenttype && !loadedPluginTypes[entry.path]) {
        const contentTypeLower = entry.contenttype.toLowerCase();
        
        // Get the plugin class name from config mapping
        const className = config.plugins?.pd?.contentTypes?.[contentTypeLower] || 
                         (entry.contenttype.charAt(0).toUpperCase() + entry.contenttype.slice(1) + 'Plugin');
        
        console.log(`Looking up plugin for content type "${contentTypeLower}": ${className}`);
        
        loadPluginByClassName('PD', className)
          .then((loadedPlugin) => {
            if (loadedPlugin) {
              console.log(`Successfully loaded plugin ${className} for content type ${entry.contenttype}`);
              
              // Register the plugin with the content type for easy lookup
              registerPlugin('PD', contentTypeLower, loadedPlugin);
              
              setLoadedPluginTypes(prev => ({
                ...prev,
                [entry.path]: contentTypeLower
              }));
            } else {
              setLoadedPluginTypes(prev => ({
                ...prev,
                [entry.path]: 'default'
              }));
            }
          })
          .catch(err => {
            console.warn(`Could not load plugin ${className} for ${entry.contenttype}, will use default plugin:`, err);
            setLoadedPluginTypes(prev => ({
              ...prev,
              [entry.path]: 'default'
            }));
          });
      }
      
      const pluginType = loadedPluginTypes[entry.path] || defaultPluginType;
      console.log(`Creating entry for ${entry.path}: pluginType=${pluginType}, loadedPluginTypes[${entry.path}]=${loadedPluginTypes[entry.path]}`);
      
      return {
        ...entry,
        content: content,
        pluginType: pluginType
      };
    });
    
    setPdEntries(enrichedEntries);
  }, [manifestData, zipContents, loadedPluginTypes]);
  
  const currentEntry = pdEntries[activeFileTab];
  const currentPluginType = currentEntry?.pluginType || 'default';
  
  console.log('PdPanel render - currentEntry:', currentEntry?.path, 'pluginType:', currentPluginType, 'loadedPluginTypes:', loadedPluginTypes);
  
  return (
    <div className="card mt-3">
      <div className="card-header bg-light">
        <h6 className="mb-0">Peripheral Data</h6>
        
        {pdEntries.length > 1 && (
          <ul className="nav nav-tabs card-header-tabs mt-2">
            {pdEntries.map((entry, index) => (
              <li className="nav-item" key={index}>
                <button 
                  className={`nav-link ${activeFileTab === index ? 'active' : ''}`}
                  onClick={() => setActiveFileTab(index)}
                >
                  <div className="d-flex flex-column align-items-start">
                    <span>{entry.contenttype || 'Unknown'}</span>
                    <small className="text-muted">{entry.mimetype}</small>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="card-body">
        {currentEntry && (
          <div className="tab-content">
            {currentPluginType === 'default' ? (
              <DefaultPdPlugin 
                data={currentEntry.content} 
                mmfgid={mmfgid} 
                fileInfo={currentEntry} 
              />
            ) : (
              createPluginWithFallback(
                'PD', 
                currentPluginType, 
                { 
                  data: currentEntry.content, 
                  mmfgid, 
                  fileInfo: currentEntry 
                },
                DefaultPdPlugin
              )
            )}
          </div>
        )}
        
        {pdEntries.length === 0 && (
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
