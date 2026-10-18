import React from 'react';
import { render, screen } from '@testing-library/react';
import NodeTable from './nodetable';
import { Playback } from './playback/PlaybackContext';

test('renders nodes whose timerange is null (as sent by the GMAF service)', () => {
  const data = { nodes: [
    { name: 'root', timerange: null, childNodes: [{ name: 'value', timerange: null }] },
  ] };
  render(<Playback><NodeTable data={data} seekTo={jest.fn()} /></Playback>);
  expect(screen.getByText('root')).toBeInTheDocument();
  expect(screen.getByText('-value')).toBeInTheDocument();
});
