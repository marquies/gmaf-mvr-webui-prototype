import { registerPlugin } from './pluginRegistry';
import config from '../../../config/config';

//// Import plugins
//import DefaultPdPlugin from '../pd/DefaultPdPlugin';
//import HeartratePlugin from '../pd/HeartratePlugin';

// Plugin mapping for dynamic imports
const pluginComponents = {
};
  //  'DefaultPdPlugin': DefaultPdPlugin,
//  'HeartratePlugin': HeartratePlugin,
  // Add more plugin mappings as they become available
//};

/**
 * Initialize and register all available plugins based on configuration
 */
export function initializePlugins() {
  // Register plugins from configuration
  if (config.plugins) {
    // Register PD plugins
    if (config.plugins.pd) {
      // Register default PD plugin
      /*const defaultPdPluginName = config.plugins.pd.default;
      if (defaultPdPluginName && pluginComponents[defaultPdPluginName]) {
        registerPlugin('PD', 'default', pluginComponents[defaultPdPluginName]);
      }
      */
      
      // Register content-specific PD plugins
      if (config.plugins.pd.contentTypes) {
        Object.entries(config.plugins.pd.contentTypes).forEach(([contentType, pluginName]) => {
          if (pluginComponents[pluginName]) {
            registerPlugin('PD', contentType, pluginComponents[pluginName]);
          }
        });
      }
    }
    
    // Register SRD plugins (similar pattern)
    if (config.plugins.srd) {
      // Register default SRD plugin if available
      /*const defaultSrdPluginName = config.plugins.srd.default;
      if (defaultSrdPluginName && pluginComponents[defaultSrdPluginName]) {
        registerPlugin('SRD', 'default', pluginComponents[defaultSrdPluginName]);
      }
      */

      // Register content-specific SRD plugins
      if (config.plugins.srd.contentTypes) {
        Object.entries(config.plugins.srd.contentTypes).forEach(([contentType, pluginName]) => {
          if (pluginComponents[pluginName]) {
            registerPlugin('SRD', contentType, pluginComponents[pluginName]);
          }
        });
      }
    }
  }
  
  console.log('Plugin registry initialized from configuration');
}

/**
 * Dynamically load a plugin based on a class name
 * @param {string} type - The plugin type (e.g., 'PD', 'SRD')
 * @param {string} className - The class name to load
 * @returns {Promise<void>} - Promise that resolves when the plugin is loaded
 */
export async function loadPluginByClassName(type, className) {
  try {
    // Check if we already have this plugin loaded in our mapping
    if (pluginComponents[className]) {
      registerPlugin(type, className.toLowerCase(), pluginComponents[className]);
      console.log(`Loaded plugin from cache: ${className} for type ${type}`);
      return pluginComponents[className];
    }
    
    // Determine the plugin path from configuration if available
    let pluginPath;
    
    // Get plugin path from config if available
    const typeKey = type.toLowerCase();
    if (config.plugins && 
        config.plugins[typeKey] && 
        config.plugins[typeKey].paths && 
        config.plugins[typeKey].paths[className]) {
      // Use the path from config but make sure it's properly formatted
      const configPath = config.plugins[typeKey].paths[className];
      // Remove leading slash if present to make it relative
      pluginPath = configPath.startsWith('/') ? configPath.substring(1) : configPath;
    } else {
      // Default fallback path based on type
      pluginPath = `${typeKey}/${className}`;
    }
    
    // This simulates Java-style class loading
    console.log(`Attempting to load plugin from path: ${pluginPath}`);
    try {
      // Try to import using a relative path from the plugins directory
      const module = await import(`../${pluginPath}`);
      return handleModuleImport(module, type, className);
    } catch (innerError) {
      console.warn(`Failed to load plugin from relative path: ${pluginPath}`, innerError);
      try {
        // Try with absolute path from components/plugins
        const absolutePath = `../../../components/plugins/${pluginPath}`;
        console.log(`Trying absolute path: ${absolutePath}`);
        const module = await import(absolutePath);
        return handleModuleImport(module, type, className);
      } catch (absoluteError) {
        console.error(`Failed to load plugin from absolute path as well:`, absoluteError);
        throw new Error(`Could not load plugin ${className} from any path`);
      }
    }
    
  } catch (error) {
    console.error(`Failed to load plugin ${className}:`, error);
    return null;
  }
}

/**
 * Helper function to handle the imported module
 * @param {Object} module - The imported module
 * @param {string} type - The plugin type
 * @param {string} className - The class name
 * @returns {React.Component|null} - The plugin component or null
 */
function handleModuleImport(module, type, className) {
  if (module.default) {
    // Add to our plugin components mapping for future use
    pluginComponents[className] = module.default;
    
    // Register the plugin
    registerPlugin(type, className.toLowerCase(), module.default);
    console.log(`Dynamically loaded plugin: ${className} for type ${type}`);
    return module.default;
  } else {
    console.error(`Plugin ${className} does not have a default export`);
    return null;
  }
}
