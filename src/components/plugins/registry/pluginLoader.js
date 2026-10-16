import pluginRegistryInstance from './pluginRegistry';
import config from '../../../config/config';

// Literal imports make every supported plugin a discoverable lazy chunk in Vite.
// Keys are canonical configured paths, without a leading slash or .jsx suffix.
const pluginImports = {
  'pd/DefaultPdPlugin': () => import('../pd/DefaultPdPlugin.jsx'),
  'pd/HeartratePlugin': () => import('../pd/HeartratePlugin.jsx'),
  'srd/DefaultSrdPlugin': () => import('../srd/DefaultSrdPlugin.jsx'),
  'srd/RsgPlugin': () => import('../srd/RsgPlugin.jsx'),
  'mmco/DefaultMmcoPlugin': () => import('../mmco/DefaultMmcoPlugin.jsx')
};

class PluginLoader {
  constructor(registry) {
    this.registry = registry;
    this.pluginComponents = {};
  }

  /**
   * Initialize and register all available plugins based on configuration
   */
  initializePlugins() {
    if (config.plugins) {
      this._registerPdPlugins();
      this._registerSrdPlugins();
    }
    
    console.log('Plugin registry initialized from configuration');
  }

  /**
   * Register PD plugins from configuration
   * @private
   */
  _registerPdPlugins() {
    if (!config.plugins.pd) return;

    if (config.plugins.pd.contentTypes) {
      Object.entries(config.plugins.pd.contentTypes).forEach(([contentType, pluginName]) => {
        if (this.pluginComponents[pluginName]) {
          this.registry.registerPlugin('PD', contentType, this.pluginComponents[pluginName]);
        }
      });
    }
  }

  /**
   * Register SRD plugins from configuration
   * @private
   */
  _registerSrdPlugins() {
    if (!config.plugins.srd) return;

    if (config.plugins.srd.contentTypes) {
      Object.entries(config.plugins.srd.contentTypes).forEach(([contentType, pluginName]) => {
        if (this.pluginComponents[pluginName]) {
          this.registry.registerPlugin('SRD', contentType, this.pluginComponents[pluginName]);
        }
      });
    }
  }

  /**
   * Dynamically load a plugin based on a class name
   * @param {string} type - The plugin type (e.g., 'PD', 'SRD')
   * @param {string} className - The class name to load
   * @returns {Promise<React.Component|null>} - Promise that resolves with the plugin component or null
   */
  async loadPluginByClassName(type, className) {
    try {
      if (this.pluginComponents[className]) {
        this.registry.registerPlugin(type, className.toLowerCase(), this.pluginComponents[className]);
        console.log(`Loaded plugin from cache: ${className} for type ${type}`);
        return this.pluginComponents[className];
      }
      
      const pluginPath = this._resolvePluginPath(type, className);
      const canonicalPath = pluginPath.replace(/^\/+/, '').replace(/\.jsx$/, '');
      const importPlugin = pluginImports[canonicalPath];

      console.log(`Attempting to load plugin from path: ${pluginPath}`);
      if (!importPlugin) {
        console.warn(`Unknown plugin path: ${pluginPath}`);
        throw new Error(`Could not load plugin ${className} from any path`);
      }
      const module = await importPlugin();
      return this._handleModuleImport(module, type, className);
      
    } catch (error) {
      console.error(`Failed to load plugin ${className}:`, error);
      return null;
    }
  }

  /**
   * Resolve the plugin path from configuration or use default
   * @param {string} type - The plugin type
   * @param {string} className - The class name
   * @returns {string} - The resolved plugin path
   * @private
   */
  _resolvePluginPath(type, className) {
    const typeKey = type.toLowerCase();
    
    if (config.plugins && 
        config.plugins[typeKey] && 
        config.plugins[typeKey].paths && 
        config.plugins[typeKey].paths[className]) {
      const configPath = config.plugins[typeKey].paths[className];
      return configPath.startsWith('/') ? configPath.substring(1) : configPath;
    }
    
    return `${typeKey}/${className}`;
  }

  /**
   * Handle the imported module
   * @param {Object} module - The imported module
   * @param {string} type - The plugin type
   * @param {string} className - The class name
   * @returns {React.Component|null} - The plugin component or null
   * @private
   */
  _handleModuleImport(module, type, className) {
    if (module.default) {
      this.pluginComponents[className] = module.default;
      this.registry.registerPlugin(type, className.toLowerCase(), module.default);
      console.log(`Dynamically loaded plugin: ${className} for type ${type}`);
      return module.default;
    } else {
      console.error(`Plugin ${className} does not have a default export`);
      return null;
    }
  }
}

const pluginLoaderInstance = new PluginLoader(pluginRegistryInstance);

export default pluginLoaderInstance;

export const initializePlugins = () => pluginLoaderInstance.initializePlugins();

export const loadPluginByClassName = (type, className) => 
  pluginLoaderInstance.loadPluginByClassName(type, className);
