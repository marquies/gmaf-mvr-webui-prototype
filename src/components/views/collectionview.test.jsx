import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '../../test-utils/userEvent';
import CollectionView from './collectionview';
import GMAFAdapter from '../../js/GMAFAdapter';

jest.mock('../../js/GMAFAdapter');
jest.mock('./query/presentation/presentation', () => ({ cmmcos, deleteItem }) => <div>
  {(cmmcos || []).map(item => <button key={item.md.id} onClick={() => deleteItem(item.md.id)}>Delete {item.md.id}</button>)}
</div>);

beforeEach(() => { jest.spyOn(console, 'log').mockImplementation(() => {}); });

test('loads collection once and removes a deleted item from the results', async () => {
  const getCollection = jest.fn().mockResolvedValue({ page: 1, numberOfPages: 1, results: [{ md: { id: 'a' } }] });
  GMAFAdapter.getInstance.mockResolvedValue({ getCollection });
  const updateStatus = jest.fn();
  render(<CollectionView updateStatus={updateStatus} />);
  userEvent.click(await screen.findByRole('button', { name: 'Delete a' }));
  expect(screen.getByRole('heading')).toHaveTextContent('No Collection Elements');
  expect(getCollection).toHaveBeenCalledTimes(1);
  expect(getCollection).toHaveBeenCalledWith(updateStatus);
});

test('uploads image contents as base64 and refreshes the collection on success', async () => {
  const getCollection = jest.fn().mockResolvedValue({ page: 1, numberOfPages: 1, results: [] });
  const addItemToCollection = jest.fn().mockResolvedValue('true');
  GMAFAdapter.getInstance.mockResolvedValue({ getCollection, addItemToCollection });
  const alert = jest.spyOn(window, 'alert').mockImplementation(() => {});
  const { container } = render(<CollectionView updateStatus={jest.fn()} />);
  await waitFor(() => expect(getCollection).toHaveBeenCalledTimes(1));
  // The production file input is hidden and has no label or accessible role.
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  userEvent.upload(container.querySelector('input[type="file"]'), new File(['image'], 'sea.png', { type: 'image/png' }));
  await waitFor(() => expect(addItemToCollection).toHaveBeenCalledWith('sea.png', 'aW1hZ2U=', true));
  await waitFor(() => expect(getCollection).toHaveBeenCalledTimes(2));
  expect(alert).toHaveBeenCalledWith('Item added successfully!');
});
