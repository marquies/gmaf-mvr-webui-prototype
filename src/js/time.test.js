import { formatClockTime, timeOfDayMs, getBeginEnd, getShotTimeRange } from './time';

const at = (h, m, s, ms = 0) => new Date(2024, 2, 22, h, m, s, ms).getTime();

test('formats local clock time with zero padding', () => {
  expect(formatClockTime(at(9, 5, 7))).toBe('09:05:07');
  expect(formatClockTime(at(23, 59, 10))).toBe('23:59:10');
});

test('computes milliseconds since local midnight', () => {
  expect(timeOfDayMs(new Date(at(1, 2, 3, 4)))).toBe(((1 * 3600) + (2 * 60) + 3) * 1000 + 4);
});

test('takes begin from shot0 and end from the last node', () => {
  const data = { nodes: [
    { name: 'root', timerange: { begin: 1, end: 2 } },
    { name: 'shot0', timerange: { begin: 10, end: 20 } },
    { name: 'shot1', timerange: { begin: 20, end: 30 } },
  ] };
  expect(getBeginEnd(data)).toEqual([10, 30]);
  expect(getBeginEnd({ nodes: [{ name: 'only', timerange: { begin: 5, end: 6 } }] })).toEqual([5, 6]);
  expect(getBeginEnd({ nodes: [] })).toEqual(['?', '?']);
  expect(getBeginEnd(null)).toEqual(['?', '?']);
});

test('uses the shot0 range, falling back to the first node', () => {
  expect(getShotTimeRange({ nodes: [
    { name: 'root', timerange: { begin: 1, end: 2 } },
    { name: 'shot0', timerange: { begin: 10, end: 20 } },
  ] })).toEqual([10, 20]);
  expect(getShotTimeRange({ nodes: [{ name: 'root', timerange: { begin: 1, end: 2 } }] })).toEqual([1, 2]);
  expect(getShotTimeRange({ nodes: [
    { name: 'root', timerange: { begin: 1, end: 2 } },
    { name: 'shot0', timerange: { begin: null, end: 20 } },
  ] })).toEqual([1, 2]);
  expect(getShotTimeRange({ nodes: [{ name: 'root' }] })).toEqual([null, null]);
  expect(getShotTimeRange(undefined)).toEqual([null, null]);
});
