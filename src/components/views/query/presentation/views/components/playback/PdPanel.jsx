import React, { useState, useEffect, useRef } from 'react';
import { createPluginWithFallback } from '../../../../../../plugins/registry/pluginFactory';
import { initializePlugins, loadPluginByClassName } from '../../../../../../plugins/registry/pluginLoader';
import { registerPlugin } from '../../../../../../plugins/registry/pluginRegistry';
import DefaultPdPlugin from '../../../../../../plugins/pd/DefaultPdPlugin';
import config from '../../../../../../../config/config';

/**
 * Component for Peripheral Data Panel
 */
function PdPanel({ mmfgid, manifestData, zipContents }) {
  const [pdEntries, setPdEntries] = useState([]);
  const [activeFileTab, setActiveFileTab] = useState(0);
  const [loadedPluginTypes, setLoadedPluginTypes] = useState({});
  const pluginsLoaded = useRef(false);

  // Register the default plugin and the configured ones once
  useEffect(() => {
    if (!pluginsLoaded.current) {
      pluginsLoaded.current = true;
      registerPlugin('PD', 'default', DefaultPdPlugin);
      initializePlugins();
    }
  }, []);

  useEffect(() => {
    if (!manifestData || !Array.isArray(manifestData.files)) return;

    const entries = manifestData.files.filter(entry => entry.type === 'PD');

    const enrichedEntries = entries.map(entry => {
      // Load plugin based on content type, even if content isn't loaded yet
      if (entry.contenttype && !loadedPluginTypes[entry.path]) {
        const contentTypeLower = entry.contenttype.toLowerCase();

        // Plugin class name from the config mapping, else derived ('gps' -> 'GpsPlugin')
        const className = config.plugins?.pd?.contentTypes?.[contentTypeLower] ||
                         (entry.contenttype.charAt(0).toUpperCase() + entry.contenttype.slice(1) + 'Plugin');

        const setPluginType = (pluginType) =>
          setLoadedPluginTypes(prev => ({ ...prev, [entry.path]: pluginType }));

        loadPluginByClassName('PD', className)
          .then((loadedPlugin) => {
            if (loadedPlugin) {
              // Register the plugin with the content type for easy lookup
              registerPlugin('PD', contentTypeLower, loadedPlugin);
              setPluginType(contentTypeLower);
            } else {
              setPluginType('default');
            }
          })
          .catch(err => {
            console.warn(`Could not load plugin ${className} for ${entry.contenttype}, will use default plugin:`, err);
            setPluginType('default');
          });
      }

      return {
        ...entry,
        content: zipContents && zipContents[entry.path] ? zipContents[entry.path] : null,
        pluginType: loadedPluginTypes[entry.path] || 'default'
      };
    });

    setPdEntries(enrichedEntries);
  }, [manifestData, zipContents, loadedPluginTypes]);

  const currentEntry = pdEntries[activeFileTab];
  const currentPluginType = currentEntry?.pluginType || 'default';

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
