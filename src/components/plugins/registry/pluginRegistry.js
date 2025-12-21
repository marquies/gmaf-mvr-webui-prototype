/**
 * Plugin Registry for dynamically loading and managing plugins
 */

// Plugin registry storage
const plugins = {};

/**
 * Register a plugin with the registry
 * @param {string} type - The plugin type (e.g., 'PD', 'SRD')
 * @param {string} contentType - The content type the plugin handles (e.g., 'heartrate', 'gps')
 * @param {React.Component} component - The React component to render
 */
export function registerPlugin(type, contentType, component) {
  if (!plugins[type]) {
    plugins[type] = {};
  }
  plugins[type][contentType] = component;
}

/**
 * Get a plugin from the registry
 * @param {string} type - The plugin type (e.g., 'PD', 'SRD')
 * @param {string} contentType - The content type to find a plugin for
 * @returns {React.Component|null} - The plugin component or null if not found
 */
export function getPlugin(type, contentType) {
  if (plugins[type] && plugins[type][contentType]) {
    return plugins[type][contentType];
  }
  
  // Return default plugin if available
  if (plugins[type] && plugins[type].default) {
    return plugins[type].default;
  }
  
  return null;
}

/**
 * Check if a plugin exists for a given type and content type
 * @param {string} type - The plugin type
 * @param {string} contentType - The content type
 * @returns {boolean} - Whether the plugin exists
 */
export function hasPlugin(type, contentType) {
  return !!(plugins[type] && plugins[type][contentType]);
}

/**
 * Get all registered plugins for a type
 * @param {string} type - The plugin type
 * @returns {Object} - Object with contentType keys and component values
 */
export function getAllPluginsForType(type) {
  return plugins[type] || {};
}
