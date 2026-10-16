import registry, { registerPlugin, getPlugin, hasPlugin, getAllPluginsForType } from './pluginRegistry';

beforeEach(() => { registry.plugins = {}; });
afterEach(() => { registry.plugins = {}; });

test('registers and replaces a plugin without affecting other types', () => {
  const first = () => null;
  const second = () => null;
  registerPlugin('PD', 'heart', first);
  registerPlugin('SRD', 'heart', second);
  expect(getPlugin('PD', 'heart')).toBe(first);
  registerPlugin('PD', 'heart', second);
  expect(getPlugin('PD', 'heart')).toBe(second);
  expect(getAllPluginsForType('SRD')).toEqual({ heart: second });
  expect(getAllPluginsForType('missing')).toEqual({});
});

test('falls back to default while hasPlugin checks only exact registrations', () => {
  const fallback = () => null;
  registerPlugin('PD', 'default', fallback);
  expect(getPlugin('PD', 'unknown')).toBe(fallback);
  expect(hasPlugin('PD', 'unknown')).toBe(false);
  expect(hasPlugin('PD', 'default')).toBe(true);
  expect(getPlugin('missing', 'unknown')).toBeNull();
});
