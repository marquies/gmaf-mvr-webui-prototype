import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const PlaybackContext = createContext(null);

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};

export const PlaybackProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [globalStartTime, setGlobalStartTime] = useState(null);
  const [globalEndTime, setGlobalEndTime] = useState(null);
  const componentRangesRef = useRef({});
  const playbackStartTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  const play = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true);
      playbackStartTimeRef.current = Date.now() - currentTime;
      
      const updateTime = () => {
        if (playbackStartTimeRef.current) {
          const elapsed = Date.now() - playbackStartTimeRef.current;
          setCurrentTime(elapsed);
          animationFrameRef.current = requestAnimationFrame(updateTime);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  }, [isPlaying, currentTime]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    playbackStartTimeRef.current = null;
  }, []);

  const reset = useCallback(() => {
    pause();
    setCurrentTime(0);
  }, [pause]);

  const registerComponent = useCallback((componentId, startTimeMs, endTimeMs) => {
    componentRangesRef.current[componentId] = { startTimeMs, endTimeMs };
    
    // Recalculate global start and end times
    const ranges = Object.values(componentRangesRef.current);
    if (ranges.length > 0) {
      const minStart = Math.min(...ranges.map(r => r.startTimeMs));
      const maxEnd = Math.max(...ranges.map(r => r.endTimeMs));
      setGlobalStartTime(minStart);
      setGlobalEndTime(maxEnd);
    }
  }, []);

  const unregisterComponent = useCallback((componentId) => {
    delete componentRangesRef.current[componentId];
    
    // Recalculate global start and end times
    const ranges = Object.values(componentRangesRef.current);
    if (ranges.length > 0) {
      const minStart = Math.min(...ranges.map(r => r.startTimeMs));
      const maxEnd = Math.max(...ranges.map(r => r.endTimeMs));
      setGlobalStartTime(minStart);
      setGlobalEndTime(maxEnd);
    } else {
      setGlobalStartTime(null);
      setGlobalEndTime(null);
    }
  }, []);

  const getAbsoluteTime = useCallback(() => {
    if (globalStartTime === null) return 0;
    return globalStartTime + currentTime;
  }, [globalStartTime, currentTime]);

  const seek = useCallback((time) => {
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      pause();
    }
    setCurrentTime(time);
    if (wasPlaying) {
      playbackStartTimeRef.current = Date.now() - time;
      const updateTime = () => {
        if (playbackStartTimeRef.current) {
          const elapsed = Date.now() - playbackStartTimeRef.current;
          setCurrentTime(elapsed);
          animationFrameRef.current = requestAnimationFrame(updateTime);
        }
      };
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  }, [isPlaying, pause]);

  // Auto-stop when reaching the end
  useEffect(() => {
    if (isPlaying && globalEndTime !== null && globalStartTime !== null) {
      const absoluteTime = globalStartTime + currentTime;
      if (absoluteTime >= globalEndTime) {
        pause();
      }
    }
  }, [currentTime, globalEndTime, globalStartTime, isPlaying, pause]);

  const value = {
    isPlaying,
    currentTime,
    globalStartTime,
    globalEndTime,
    play,
    pause,
    reset,
    seek,
    registerComponent,
    unregisterComponent,
    getAbsoluteTime
  };

  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
};
