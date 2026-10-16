import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '../../../../../test-utils/userEvent';
import BrowseView from './browseview';

// Keep the real Filter and AssetCard; isolate media engines and hover details.
jest.mock('./components/multimedia', () => () => <div>Media preview</div>);
jest.mock('./components/tooltip', () => () => null);
const assets = [
  { id: 'a', generalMetadata: { fileName: 'Sea.PNG', creationDate: '2025-01-01' } },
  { id: 'b', generalMetadata: { fileName: 'Mountain.mp4', creationDate: '2025-02-01' } },
];
beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

test('filters filenames case-insensitively, clears the filter, and selects an asset', () => {
  const onSelectItem = jest.fn();
  render(<BrowseView cmmcos={assets} numOfAllResults={2} onSelectItem={onSelectItem} />);
  // Filename currently has no accessible label; the other textboxes are date pickers.
  const input = screen.getAllByRole('textbox')[0];
  userEvent.type(input, 'SEA');
  expect(screen.getByText('Sea.PNG')).toBeInTheDocument();
  expect(screen.queryByText('Mountain.mp4')).not.toBeInTheDocument();
  userEvent.clear(input);
  expect(screen.getByText('Mountain.mp4')).toBeInTheDocument();
  userEvent.click(screen.getByText('Mountain.mp4'));
  expect(onSelectItem).toHaveBeenCalledWith('b');
});

test('filters by media type and restores all results', () => {
  render(<BrowseView cmmcos={assets} numOfAllResults={2} />);
  userEvent.click(screen.getByRole('button', { name: 'Video' }));
  expect(screen.queryByText('Sea.PNG')).not.toBeInTheDocument();
  expect(screen.getByText('Mountain.mp4')).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: 'No type filter' }));
  expect(screen.getByText('Sea.PNG')).toBeInTheDocument();
});

test('hides the results notice after three seconds and refreshes incoming results', () => {
  const { rerender } = render(<BrowseView cmmcos={assets} numOfAllResults={2} />);
  expect(screen.getByRole('alert')).toHaveStyle({ opacity: '1' });
  act(() => jest.advanceTimersByTime(3000));
  expect(screen.getByRole('alert')).toHaveStyle({ opacity: '0' });
  rerender(<BrowseView cmmcos={[assets[1]]} numOfAllResults={1} />);
  expect(screen.queryByText('Sea.PNG')).not.toBeInTheDocument();
  expect(screen.getByText('Mountain.mp4')).toBeInTheDocument();
});
