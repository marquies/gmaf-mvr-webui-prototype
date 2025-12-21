// config.js
const config = {
    appKey: 'letmein',
    baseUrl: 'http://localhost:8242/gmaf/gmafApi',
    useAlternativeDetailsView: true, // Set to true to use the alternative details view
    
    // Plugin configuration
    plugins: {
        // PD (Peripheral Data) plugins
        pd: {
            // Default plugin for PD type
            default: 'DefaultPdPlugin',
            // Content-specific plugins
            contentTypes: {
                'heartrate': 'HeartratePlugin',
            },
            // Plugin paths for dynamic loading
            paths: {
                'DefaultPdPlugin': '/pd/DefaultPdPlugin.jsx',
                'HeartratePlugin': '/pd/HeartratePlugin.jsx',
                // Add more path mappings as needed
            }
        },
        // SRD (Structured Related Data) plugins
        srd: {
            default: 'DefaultSrdPlugin',
            contentTypes: {
                'RSG': 'RSGPlugin',
            },
            // Plugin paths for dynamic loading
            paths: {
                'DefaultSrdPlugin': '/srd/DefaultSrdPlugin.jsx',
                'RSGPlugin': '/srd/RsgPlugin.jsx',
                // Add more path mappings as needed
            }
        }
    }
};

module.exports = config;