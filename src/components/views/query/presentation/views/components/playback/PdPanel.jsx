import React, { useState, useEffect } from 'react';
import { createPluginWithFallback } from '../../../../../../../components/plugins/registry/pluginFactory';
import { initializePlugins, loadPluginByClassName } from '../../../../../../../components/plugins/registry/pluginLoader';

/**
 * Component for Peripheral Data Panel
 */
function PdPanel({ mmfgid, manifestData, zipContents }) {
  const [pluginContent, setPluginContent] = useState(null);
  const [pdEntry, setPdEntry] = useState(null);
  
  // Initialize plugins on first render
  useEffect(() => {
    initializePlugins();
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
            
            // Attempt to load the plugin dynamically
            loadPluginByClassName('PD', className).catch(err => {
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
      <div className="card-header bg-light">
        <h6 className="mb-0">Peripheral Data</h6>
      </div>
      <div className="card-body">
        {pdEntry && (
          createPluginWithFallback(
            'PD', 
            pdEntry.content || 'default', 
            { 
              data: pluginContent, 
              mmfgid, 
              fileInfo: pdEntry 
            },
            //DefaultPdPlugin
          )
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
