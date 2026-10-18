import React, { useState, useEffect, useRef } from 'react';
import { createPluginWithFallback } from '../../../../../../plugins/registry/pluginFactory';
import { initializePlugins, loadPluginByClassName } from '../../../../../../plugins/registry/pluginLoader';
import { getAllPluginsForType, registerPlugin } from '../../../../../../plugins/registry/pluginRegistry';
import DefaultSrdPlugin from '../../../../../../plugins/srd/DefaultSrdPlugin';
import config from '../../../../../../../config/config';

/**
 * Component for Structured Related Data Panel
 */
function SrdPanel({ mmfgid, manifestData, zipContents }) {
  const [pluginContent, setPluginContent] = useState(null);
  const [srdEntry, setSrdEntry] = useState(null);
  const [availablePlugins, setAvailablePlugins] = useState(['default']);
  const [activePlugin, setActivePlugin] = useState('default');
  const pluginsLoaded = useRef(false);

  const refreshAvailablePlugins = () => {
    const pluginTypes = Object.keys(getAllPluginsForType('SRD'));
    setAvailablePlugins(['default', ...pluginTypes.filter(type => type !== 'default')]);
  };

  // Register the default plugin and the configured ones once
  useEffect(() => {
    if (!pluginsLoaded.current) {
      pluginsLoaded.current = true;
      registerPlugin('SRD', 'default', DefaultSrdPlugin);
      initializePlugins();
      // Small delay to ensure plugins are registered
      setTimeout(refreshAvailablePlugins, 100);
    }
  }, []);

  useEffect(() => {
    if (!manifestData || !Array.isArray(manifestData.files)) return;

    const entry = manifestData.files.find(entry => entry.type === 'SRD');
    if (!entry) return;

    setSrdEntry(entry);

    if (zipContents && zipContents[entry.path]) {
      setPluginContent(zipContents[entry.path]);

      if (entry.contenttype) {
        // Plugin class name comes from the config mapping
        const className = config.plugins?.srd?.contentTypes?.[entry.contenttype.toLowerCase()];
        setActivePlugin(entry.contenttype.toLowerCase());

        loadPluginByClassName('SRD', className)
          .then(refreshAvailablePlugins)
          .catch(err => {
            console.warn(`Could not load plugin ${className}, using default:`, err);
          });
      }
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
