import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '../../../../../../test-utils/userEvent';
import AssetCard from './assetCard';

jest.mock('./multimedia', () => () => <div>Media preview</div>);
jest.mock('./tooltip', () => () => <div>Asset metadata</div>);
const asset = { id: 'a', generalMetadata: { fileName: 'Sea.png' }, hasPd: true, hasWsd: true, tempSimilarity: [0.95, 0.44] };

test('renders asset metadata, rounded similarity and optional data indicators', () => {
  render(<AssetCard cmmco={asset} />);
  expect(screen.getByText('Sea.png')).toBeInTheDocument();
  expect(screen.getByText('Peripheral Data')).toBeInTheDocument();
  expect(screen.getByText('World Specific Data')).toBeInTheDocument();
  expect(screen.getByText(/Sim:/)).toHaveTextContent('Sim: 0.9, 0.4');
});

test('supports selection and using an asset as a query example via its context menu', () => {
  const onSelect = jest.fn();
  const onUseAsQueryExample = jest.fn();
  render(<AssetCard cmmco={asset} onSelect={onSelect} onUseAsQueryExample={onUseAsQueryExample} />);
  userEvent.click(screen.getByText('Sea.png'));
  expect(onSelect).toHaveBeenCalledTimes(1);
  fireEvent.contextMenu(screen.getByText('Sea.png'), { clientX: 10, clientY: 20 });
  userEvent.click(screen.getByText('Use as Query Example'));
  expect(onUseAsQueryExample).toHaveBeenCalledWith(asset);
  expect(screen.queryByText('Use as Query Example')).not.toBeInTheDocument();
});

test('closes the context menu on outside click and renders nothing without an asset', () => {
  const { rerender } = render(<AssetCard cmmco={asset} />);
  fireEvent.contextMenu(screen.getByText('Sea.png'));
  userEvent.click(document.body);
  expect(screen.queryByText('Use as Query Example')).not.toBeInTheDocument();
  rerender(<AssetCard cmmco={null} />);
  expect(screen.queryByText('Sea.png')).not.toBeInTheDocument();
});
