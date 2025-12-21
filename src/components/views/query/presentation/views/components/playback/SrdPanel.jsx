import React, { useState, useEffect } from 'react';
import { createPluginWithFallback } from '../../../../../../../components/plugins/registry/pluginFactory';
import { initializePlugins, loadPluginByClassName } from '../../../../../../../components/plugins/registry/pluginLoader';

/**
 * Component for Structured Related Data Panel
 */
function SrdPanel({ mmfgid, manifestData, zipContents }) {
  const [pluginContent, setPluginContent] = useState(null);
  const [srdEntry, setSrdEntry] = useState(null);
  
  // Initialize plugins on first render
  useEffect(() => {
    initializePlugins();
    console.log('SRD Panel: Initialized plugins');
  }, []);
  
  useEffect(() => {
    if (manifestData && Array.isArray(manifestData.files)) {
      // Find SRD entry in manifest
      const srdEntry = manifestData.files.find(entry => entry.type === 'SRD');
      
      if (srdEntry) {
        console.log('SRD Panel can show:', srdEntry);
        console.log('SRD file path:', srdEntry.path);
        console.log('SRD mimetype:', srdEntry.mimetype);
        console.log('SRD content type:', srdEntry.content);
        
        setSrdEntry(srdEntry);

        // If we have the content in zipContents, we could use it directly
        if (zipContents && zipContents[srdEntry.path]) {
          console.log('SRD content available in zipContents');
          setPluginContent(zipContents[srdEntry.path]);
          
          // Try to dynamically load a plugin based on the content type
          if (srdEntry.content) {
            // Convert content type to potential class name (e.g., 'rsg' -> 'RsgPlugin')
            const className = srdEntry.content.charAt(0).toUpperCase() + srdEntry.content.slice(1) + 'Plugin';
            console.log('SRD Panel: Attempting to load plugin:', className);
            
            // Attempt to load the plugin dynamically
            loadPluginByClassName('SRD', className).catch(err => {
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
      <div className="card-header bg-light">
        <h6 className="mb-0">Srd Data</h6>
      </div>
      <div className="card-body">
                
                {srdEntry && (
                  <div>
                    {createPluginWithFallback(
                      'SRD', 
                      srdEntry.content || 'default', 
                      { 
                        data: pluginContent, 
                        mmfgid, 
                        fileInfo: srdEntry 
                      },
                      null
                    ) || (
                      <div className="alert alert-warning">
                        <i className="fa fa-exclamation-triangle me-2"></i>
                        Plugin not found for content type: {srdEntry.content || 'default'}
                      </div>
                    )}
                  </div>
                )}

              {!srdEntry && (
                <div className="alert alert-secondary">
                  <i className="fa fa-info-circle me-2"></i>
                  No srd data available
                </div>
              )}
      </div>
    </div>
  );
}

export default SrdPanel;
