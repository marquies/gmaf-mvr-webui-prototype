import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { Playback, usePlayback } from './PlaybackContext';

const wrapper = ({ children }) => <Playback>{children}</Playback>;
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2025-01-01T00:00:00Z'));
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

test('aggregates registered ranges and recalculates them on removal', () => {
  const { result } = renderHook(usePlayback, { wrapper });
  expect(result.current.getAbsoluteTime()).toBe(0);
  act(() => {
    result.current.registerComponent('video', 1000, 5000);
    result.current.registerComponent('audio', 500, 7000);
  });
  expect(result.current.globalStartTime).toBe(500);
  expect(result.current.globalEndTime).toBe(7000);
  act(() => result.current.seek(250));
  expect(result.current.getAbsoluteTime()).toBe(750);
  act(() => result.current.unregisterComponent('audio'));
  expect(result.current.globalStartTime).toBe(1000);
  expect(result.current.globalEndTime).toBe(5000);
  act(() => result.current.unregisterComponent('video'));
  expect(result.current.globalStartTime).toBeNull();
  expect(result.current.globalEndTime).toBeNull();
});

test('advances while playing, freezes on pause, and resets to zero', () => {
  const { result } = renderHook(usePlayback, { wrapper });
  act(() => result.current.play());
  act(() => jest.advanceTimersByTime(160));
  expect(result.current.isPlaying).toBe(true);
  expect(result.current.currentTime).toBeGreaterThan(0);
  act(() => result.current.pause());
  const paused = result.current.currentTime;
  act(() => jest.advanceTimersByTime(160));
  expect(result.current.currentTime).toBe(paused);
  act(() => result.current.reset());
  expect(result.current.isPlaying).toBe(false);
  expect(result.current.currentTime).toBe(0);
});

test('automatically pauses when playback reaches the registered end', () => {
  const { result } = renderHook(usePlayback, { wrapper });
  act(() => result.current.registerComponent('clip', 1000, 1100));
  act(() => result.current.play());
  act(() => jest.advanceTimersByTime(160));
  expect(result.current.isPlaying).toBe(false);
  expect(result.current.getAbsoluteTime()).toBeGreaterThanOrEqual(1100);
});
