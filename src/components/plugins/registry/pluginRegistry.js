/**
 * Plugin Registry for dynamically loading and managing plugins
 */
class PluginRegistry {
  constructor() {
    this.plugins = {};
  }

  /**
   * Register a plugin with the registry
   * @param {string} type - The plugin type (e.g., 'PD', 'SRD')
   * @param {string} contentType - The content type the plugin handles (e.g., 'heartrate', 'gps')
   * @param {React.Component} component - The React component to render
   */
  registerPlugin(type, contentType, component) {
    if (!this.plugins[type]) {
      this.plugins[type] = {};
    }
    this.plugins[type][contentType] = component;
  }

  /**
   * Get a plugin from the registry
   * @param {string} type - The plugin type (e.g., 'PD', 'SRD')
   * @param {string} contentType - The content type to find a plugin for
   * @returns {React.Component|null} - The plugin component or null if not found
   */
  getPlugin(type, contentType) {
    if (this.plugins[type] && this.plugins[type][contentType]) {
      return this.plugins[type][contentType];
    }
    
    // Return default plugin if available
    if (this.plugins[type] && this.plugins[type].default) {
      return this.plugins[type].default;
    }
    
    return null;
  }

  /**
   * Check if a plugin exists for a given type and content type
   * @param {string} type - The plugin type
   * @param {string} contentType - The content type
   * @returns {boolean} - Whether the plugin exists
   */
  hasPlugin(type, contentType) {
    return !!(this.plugins[type] && this.plugins[type][contentType]);
  }

  /**
   * Get all registered plugins for a type
   * @param {string} type - The plugin type
   * @returns {Object} - Object with contentType keys and component values
   */
  getAllPluginsForType(type) {
    return this.plugins[type] || {};
  }
}

const pluginRegistryInstance = new PluginRegistry();

export default pluginRegistryInstance;

export const registerPlugin = (type, contentType, component) => 
  pluginRegistryInstance.registerPlugin(type, contentType, component);

export const getPlugin = (type, contentType) => 
  pluginRegistryInstance.getPlugin(type, contentType);

export const hasPlugin = (type, contentType) => 
  pluginRegistryInstance.hasPlugin(type, contentType);

export const getAllPluginsForType = (type) => 
  pluginRegistryInstance.getAllPluginsForType(type);
