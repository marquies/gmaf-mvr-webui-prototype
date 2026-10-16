import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '../../test-utils/userEvent';
import QueryView from './queryview';
import GMAFAdapter from '../../js/GMAFAdapter';

jest.mock('react-tag-input');
jest.mock('../../js/GMAFAdapter');
jest.mock('./query/presentation/presentation', () => ({ cmmcos, onSelectItem, onAddQueryExample }) => <div>
  {(cmmcos || []).map(item => <div key={item.id}>
    <button onClick={() => onSelectItem(item.id)}>Select {item.id}</button>
    <button onClick={() => onAddQueryExample(item)}>Example {item.id}</button>
  </div>)}
</div>);
jest.mock('./query/presentation/views/detailsSelector', () => ({ mmfgid }) => <div>Details: {mmfgid || 'none'}</div>);

beforeEach(() => { jest.spyOn(console, 'log').mockImplementation(() => {}); });

test('submits a real query form, renders fetched results, and selects details', async () => {
  const fetchMinimalBatch = jest.fn().mockResolvedValue([{ id: 'a' }]);
  const query = jest.fn().mockResolvedValue({ totalResults: 1, fetchMinimalBatch });
  GMAFAdapter.getInstance.mockResolvedValue({ query });
  const updateStatus = jest.fn();
  render(<QueryView updateStatus={updateStatus} presentationView="browse" />);
  expect(screen.getByText('Details: none')).toBeInTheDocument();
  userEvent.type(screen.getByPlaceholderText('Type and press enter or comma to add keywords'), 'sea{enter}');
  userEvent.click(screen.getByRole('button', { name: 'Query' }));
  userEvent.click(await screen.findByRole('button', { name: 'Select a' }));
  expect(screen.getByText('Details: a')).toBeInTheDocument();
  expect(query).toHaveBeenCalledWith(expect.objectContaining({ cmmcoQuery: expect.objectContaining({ md: { keywords: 'sea' } }), filter: false }), updateStatus);
  expect(fetchMinimalBatch).toHaveBeenCalledWith(0, 20);
});

test('renders an explicit empty-results message after a successful empty query', async () => {
  GMAFAdapter.getInstance.mockResolvedValue({ query: jest.fn().mockResolvedValue({ totalResults: 0, fetchMinimalBatch: jest.fn().mockResolvedValue([]) }) });
  render(<QueryView updateStatus={jest.fn()} />);
  userEvent.click(screen.getByRole('button', { name: 'Query' }));
  expect(await screen.findByText('No matching results found')).toBeInTheDocument();
});

test('does not attempt a query when adapter initialization fails', async () => {
  GMAFAdapter.getInstance.mockResolvedValue(false);
  render(<QueryView updateStatus={jest.fn()} />);
  userEvent.click(screen.getByRole('button', { name: 'Query' }));
  await waitFor(() => expect(GMAFAdapter.getInstance).toHaveBeenCalled());
  expect(screen.queryByText('No matching results found')).not.toBeInTheDocument();
});
