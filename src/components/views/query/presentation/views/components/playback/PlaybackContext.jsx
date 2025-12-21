import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

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
  const [startTime, setStartTime] = useState(null);
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
    setStartTime(null);
  }, [pause]);

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

  const value = {
    isPlaying,
    currentTime,
    startTime,
    setStartTime,
    play,
    pause,
    reset,
    seek
  };

  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
};
