import React from 'react';
import { render, screen } from '@testing-library/react';
import registry from './pluginRegistry';
import { createPlugin, createPluginWithFallback } from './pluginFactory';

beforeEach(() => { registry.plugins = {}; });
afterEach(() => { registry.plugins = {}; });
const Plugin = ({ value }) => <p>Plugin: {value}</p>;
const Fallback = ({ value }) => <p>Fallback: {value}</p>;

test('renders registered plugins and forwards props', () => {
  registry.registerPlugin('PD', 'heart', Plugin);
  render(createPlugin('PD', 'heart', { value: 72 }));
  expect(screen.getByText('Plugin: 72')).toBeInTheDocument();
});

test('uses a supplied fallback only when the registry cannot resolve a plugin', () => {
  const { rerender } = render(createPluginWithFallback('PD', 'missing', { value: 1 }, Fallback));
  expect(screen.getByText('Fallback: 1')).toBeInTheDocument();
  registry.registerPlugin('PD', 'default', Plugin);
  rerender(createPluginWithFallback('PD', 'missing', { value: 2 }, Fallback));
  expect(screen.getByText('Plugin: 2')).toBeInTheDocument();
  expect(screen.queryByText('Fallback: 1')).not.toBeInTheDocument();
});

test('returns null for missing plugins without a fallback', () => {
  const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
  expect(createPlugin('missing', 'unknown', {})).toBeNull();
  expect(warning).toHaveBeenCalledWith(expect.stringContaining('No plugin found'));
  expect(createPluginWithFallback('missing', 'unknown', {})).toBeNull();
});
