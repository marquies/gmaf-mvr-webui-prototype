import { renderHook, act } from '@testing-library/react';
import { useQueryHandler } from './QueryHandler';
import GMAFAdapter from '../../../../js/GMAFAdapter';

jest.mock('../../../../js/GMAFAdapter');

test('joins tag text, exposes loading, and returns IDs', async () => {
  let resolveIds;
  const getQueryIds = jest.fn(() => new Promise(resolve => { resolveIds = resolve; }));
  GMAFAdapter.getInstance.mockResolvedValue({ getQueryIds });
  const { result } = renderHook(() => useQueryHandler(jest.fn()));
  let pending;
  await act(async () => { pending = result.current.fetchIds([{ text: 'sea' }, { text: 'sun' }]); });
  expect(result.current.isLoading).toBe(true);
  expect(getQueryIds).toHaveBeenCalledWith('sea,sun');
  await act(async () => { resolveIds(['asset-1']); expect(await pending).toEqual(['asset-1']); });
  expect(result.current.isLoading).toBe(false);
  expect(result.current.error).toBeNull();
});

test.each(['unavailable adapter', 'request failure'])('reports %s and always resets loading', async mode => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  GMAFAdapter.getInstance.mockResolvedValue(mode === 'unavailable adapter' ? false : {
    getQueryIds: jest.fn().mockRejectedValue(new Error('Backend unavailable')),
  });
  const { result } = renderHook(() => useQueryHandler());
  const message = mode === 'unavailable adapter' ? 'Failed to initialize GMAF adapter' : 'Backend unavailable';
  await act(async () => { await expect(result.current.fetchIds([])).rejects.toThrow(message); });
  expect(result.current.error).toBe(message);
  expect(result.current.isLoading).toBe(false);
});
