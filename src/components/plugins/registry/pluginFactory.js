import React from 'react';
import { getPlugin } from './pluginRegistry';

/**
 * Factory for creating plugin instances
 */

/**
 * Create a plugin component based on type and content type
 * @param {string} type - The plugin type (e.g., 'PD', 'SRD')
 * @param {string} contentType - The content type (e.g., 'heartrate', 'gps')
 * @param {Object} props - Props to pass to the plugin component
 * @returns {React.Element|null} - The plugin component instance or null if not found
 */
export function createPlugin(type, contentType, props) {
  const PluginComponent = getPlugin(type, contentType);
  
  if (!PluginComponent) {
    console.warn(`No plugin found for type: ${type}, contentType: ${contentType}`);
    return null;
  }
  
  return <PluginComponent {...props} />;
}

/**
 * Create a plugin component with fallback to default if specific one not found
 * @param {string} type - The plugin type (e.g., 'PD', 'SRD')
 * @param {string} contentType - The content type (e.g., 'heartrate', 'gps')
 * @param {Object} props - Props to pass to the plugin component
 * @param {React.Component} FallbackComponent - Component to use if no plugin found
 * @returns {React.Element} - The plugin component instance or fallback
 */
export function createPluginWithFallback(type, contentType, props, FallbackComponent) {
  const PluginComponent = getPlugin(type, contentType);
  
  if (!PluginComponent) {
    return FallbackComponent ? <FallbackComponent {...props} /> : null;
  }
  
  return <PluginComponent {...props} />;
}
