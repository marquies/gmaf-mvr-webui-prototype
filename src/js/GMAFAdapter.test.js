import GMAFAdapter from './GMAFAdapter';

beforeEach(() => {
  GMAFAdapter.GMAFInstance = false;
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => { GMAFAdapter.GMAFInstance = false; });

test('initializes a singleton once and reuses its token', async () => {
  const token = jest.spyOn(GMAFAdapter.prototype, 'getToken').mockResolvedValue('test-token');
  const first = await GMAFAdapter.getInstance();
  expect(first.apiToken).toBe('test-token');
  expect(await GMAFAdapter.getInstance()).toBe(first);
  expect(token).toHaveBeenCalledTimes(1);
});

test.each(['', null, 42])('rejects invalid initialization token %p without caching an instance', async token => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(GMAFAdapter.prototype, 'getToken').mockResolvedValue(token);
  expect(await GMAFAdapter.getInstance()).toBe(false);
  expect(GMAFAdapter.GMAFInstance).toBe(false);
});

test('refuses unauthenticated requests before fetching', async () => {
  const adapter = new GMAFAdapter();
  await expect(adapter.get('private')).rejects.toThrow('GMAF Token not set');
  await expect(adapter.post('private')).rejects.toThrow('GMAF Token not set');
  expect(fetch).not.toHaveBeenCalled();
});

test('posts JSON to the configured base path and parses the response', async () => {
  const adapter = new GMAFAdapter('test-token');
  fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(['a']) });
  expect(await adapter.post('assets', true, { name: 'sea' })).toEqual(['a']);
  expect(fetch).toHaveBeenCalledWith(`${adapter.basePath}assets`, {
    method: 'POST', headers: {}, body: JSON.stringify({ name: 'sea' }),
  });
});

test('reports HTTP and network failures without returning data', async () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  const adapter = new GMAFAdapter('test-token');
  fetch.mockResolvedValueOnce({ ok: false, status: 503 });
  expect(await adapter.post('assets', true)).toBeUndefined();
  expect(error).toHaveBeenCalledWith(expect.objectContaining({ message: 'HTTP error! Status: 503' }));
  fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
  expect(await adapter.get('assets', 'json')).toBeUndefined();
  expect(error).toHaveBeenCalledWith('GMAF Service not reachable');
});

test.each([false, []])('returns an empty lazy query for response %p', async response => {
  const adapter = new GMAFAdapter('test-token');
  jest.spyOn(adapter, 'getQueryIds').mockResolvedValue(response);
  const results = await adapter.query({});
  expect(results.totalResults).toBe(0);
  expect(await results.fetchMinimalBatch(0, 20)).toEqual([]);
});

test('loads only requested query batches and reports absolute progress', async () => {
  const adapter = new GMAFAdapter('test-token');
  jest.spyOn(adapter, 'getQueryIds').mockResolvedValue(['a', 'b', 'c']);
  const minimal = jest.spyOn(adapter, 'getCMMCOMinimal').mockImplementation(async id => ({ id }));
  const progress = jest.fn();
  const results = await adapter.query({ cmmcoQuery: { md: { keywords: 'sea' } } }, progress);
  expect(results.totalResults).toBe(3);
  expect(minimal).not.toHaveBeenCalled();
  expect(await results.fetchMinimalBatch(1, 20)).toEqual([{ id: 'b' }, { id: 'c' }]);
  expect(minimal.mock.calls).toEqual([['b'], ['c']]);
  expect(progress.mock.calls).toEqual([[2, 3], [3, 3]]);
});

test('normalizes similarity results containing objects and plain IDs', async () => {
  const adapter = new GMAFAdapter('test-token');
  jest.spyOn(adapter, 'getSim').mockResolvedValue([{ id: 'a', score: 0.9 }, 'b']);
  jest.spyOn(adapter, 'getCMMCOMinimal').mockImplementation(async id => ({ id }));
  const results = await adapter.similarity('example');
  expect(results.queryIds).toEqual(['a', 'b']);
  expect(await results.fetchMinimalBatch(0, 1)).toEqual([{ id: 'a' }]);
});

test('projects minimal metadata and handles missing assets', async () => {
  const adapter = new GMAFAdapter('test-token');
  jest.spyOn(adapter, 'getCMMCO').mockResolvedValue({ generalMetadata: { fileName: 'a.png' }, start: 1, end: 2, pd: { pulse: 72 }, wsd: {} });
  expect(await adapter.getCMMCOMinimal('a')).toEqual({ id: 'a', generalMetadata: { fileName: 'a.png' }, start: 1, end: 2, hasPd: true, hasWsd: false, tempSimilarity: undefined });
  adapter.getCMMCO.mockResolvedValue(null);
  expect(await adapter.getCMMCOMinimal('missing')).toBeNull();
  expect(await adapter.getCMMCOMinimal(null)).toBeNull();
});
