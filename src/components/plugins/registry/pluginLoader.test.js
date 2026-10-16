import loader, { loadPluginByClassName, initializePlugins } from './pluginLoader';
import registry from './pluginRegistry';

jest.mock('../../../config/config', () => ({ plugins: {
  pd: { contentTypes: { pulse: 'TestPulse' } },
  srd: { contentTypes: { scene: 'TestScene' } },
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

test('returns null and reports an error if no plugin module can be loaded', async () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(await loadPluginByClassName('PD', 'NonexistentTestPlugin')).toBeNull();
  expect(error).toHaveBeenCalled();
});
