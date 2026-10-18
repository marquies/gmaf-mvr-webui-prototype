import React, { useState, useEffect, useRef } from 'react';
import { createPluginWithFallback } from '../../../../../../plugins/registry/pluginFactory';
import { initializePlugins, loadPluginByClassName } from '../../../../../../plugins/registry/pluginLoader';
import { getAllPluginsForType, registerPlugin } from '../../../../../../plugins/registry/pluginRegistry';
import DefaultMmcoPlugin from '../../../../../../plugins/mmco/DefaultMmcoPlugin';

/**
 * Component for MMCO (Multimedia Content Object) playback panel
 */
function MmcoPanel({ playerRef, mmfgid, manifestData, zipContents }) {
  const [pluginContent, setPluginContent] = useState(null);
  const [mmcoEntry, setMmcoEntry] = useState(null);
  const [availablePlugins, setAvailablePlugins] = useState(['default']);
  const [activePlugin, setActivePlugin] = useState('default');
  const pluginsLoaded = useRef(false);

  const refreshAvailablePlugins = () => {
    const pluginTypes = Object.keys(getAllPluginsForType('MMCO'));
    setAvailablePlugins(['default', ...pluginTypes.filter(type => type !== 'default')]);
  };

  // Register the default plugin and the configured ones once
  useEffect(() => {
    if (!pluginsLoaded.current) {
      pluginsLoaded.current = true;
      registerPlugin('MMCO', 'default', DefaultMmcoPlugin);
      initializePlugins();
      // Small delay to ensure plugins are registered
      setTimeout(refreshAvailablePlugins, 100);
    }
  }, []);

  useEffect(() => {
    if (!manifestData || !Array.isArray(manifestData.files)) return;

    const entry = manifestData.files.find(entry => entry.type === 'MMCO');
    if (!entry) return;

    setMmcoEntry(entry);

    if (zipContents && zipContents[entry.path]) {
      setPluginContent(zipContents[entry.path]);

      if (entry.content) {
        // e.g. 'video' -> 'VideoPlugin'
        const className = entry.content.charAt(0).toUpperCase() + entry.content.slice(1) + 'Plugin';
        setActivePlugin(entry.content.toLowerCase());

        loadPluginByClassName('MMCO', className)
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
