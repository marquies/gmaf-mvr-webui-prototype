import loader, { loadPluginByClassName, initializePlugins } from './pluginLoader';
import registry from './pluginRegistry';

jest.mock('../../../config/config', () => ({ plugins: {
  pd: { contentTypes: { pulse: 'TestPulse' } },
  srd: { contentTypes: { scene: 'TestScene' }, paths: { RSGPlugin: '/srd/RsgPlugin.jsx' } },
} }));

beforeEach(() => {
  registry.plugins = {};
  loader.pluginComponents = {};
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => { registry.plugins = {}; loader.pluginComponents = {}; });

test('registers available configured plugins and skips unavailable ones', () => {
  const Pulse = () => null;
  loader.pluginComponents.TestPulse = Pulse;
  initializePlugins();
  expect(registry.getPlugin('PD', 'pulse')).toBe(Pulse);
  expect(registry.getPlugin('SRD', 'scene')).toBeNull();
});

test('loads a local plugin dynamically, caches it and registers its lowercase class name', async () => {
  const plugin = await loadPluginByClassName('PD', 'DefaultPdPlugin');
  expect(typeof plugin).toBe('function');
  expect(registry.getPlugin('PD', 'defaultpdplugin')).toBe(plugin);
  expect(await loadPluginByClassName('PD', 'DefaultPdPlugin')).toBe(plugin);
});

test('loads each configured plugin path, including case-sensitive RSG mapping', async () => {
  const expected = [
    ['PD', 'DefaultPdPlugin'], ['PD', 'HeartratePlugin'],
    ['SRD', 'DefaultSrdPlugin'], ['SRD', 'RSGPlugin'],
    ['MMCO', 'DefaultMmcoPlugin']
  ];
  for (const [type, className] of expected) {
    const plugin = await loadPluginByClassName(type, className);
    expect(plugin).toBeTruthy();
    expect(registry.getPlugin(type, className.toLowerCase())).toBe(plugin);
  }
});

test('returns null and reports an error if no plugin module can be loaded', async () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(await loadPluginByClassName('PD', 'NonexistentTestPlugin')).toBeNull();
  expect(error).toHaveBeenCalled();
});
