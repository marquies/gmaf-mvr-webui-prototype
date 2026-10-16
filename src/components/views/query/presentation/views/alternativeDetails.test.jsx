import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '../../../../../test-utils/userEvent';
import AlternativeDetails from './alternativeDetails';
import config from '../../../../../config/config';

jest.mock('./components/playback/PlaybackSelector', () => ({ mmfgid }) => <p>Player {mmfgid}</p>);
jest.mock('./components/nodetable', () => ({ data }) => <p>Nodes: {data.nodes.length}</p>);
const asset = { generalMetadata: { fileName: 'clip.mp4' }, nodes: [{ name: 'shot0' }] };

test('waits for selection without issuing a request', () => {
  render(<AlternativeDetails mmfgid={false} />);
  expect(screen.getByText('Select an item to view details')).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});

test('fetches selected details and switches between player, nodes and raw JSON', async () => {
  fetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(asset) });
  render(<AlternativeDetails mmfgid="asset-1" />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: 'clip.mp4' })).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith(`${config.baseUrl}/gmaf/getmmfg/token1/asset-1`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
  expect(screen.getByText('Player asset-1')).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: 'Node Structure' }));
  expect(screen.getByText('Nodes: 1')).toBeInTheDocument();
  expect(screen.queryByText('Player asset-1')).not.toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: 'Raw Data' }));
  expect(JSON.parse(screen.getByRole('textbox').value)).toEqual(asset);
});

test('clears loaded data when selection is removed', async () => {
  fetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(asset) });
  const { rerender } = render(<AlternativeDetails mmfgid="asset-1" />);
  await screen.findByRole('heading', { name: 'clip.mp4' });
  rerender(<AlternativeDetails mmfgid={false} />);
  expect(screen.getByText('Select an item to view details')).toBeInTheDocument();
  expect(screen.queryByText('clip.mp4')).not.toBeInTheDocument();
});
