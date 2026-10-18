import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import config from '../../../../../../../config/config';
import { usePlayback } from './PlaybackContext';
import { getShotTimeRange } from '../../../../../../../js/time';

/**
 * Component for video playback
 */
function VideoPlayback({ data, mmfgid, playerRef, handleSeek }) {
  const { registerComponent, unregisterComponent, currentTime, globalStartTime, isPlaying, play, pause } = usePlayback();
  const componentId = useRef(`video-${mmfgid}`);
  const internalPlayerRef = useRef(null);
  const isSeeking = useRef(false);

  // Use provided playerRef or internal ref
  const activePlayerRef = playerRef || internalPlayerRef;

  // Register this component's time range with the playback context
  useEffect(() => {
    const id = componentId.current;
    const [startTime, endTime] = getShotTimeRange(data);
    if (startTime !== null && endTime !== null) {
      registerComponent(id, startTime, endTime);
    }
    return () => {
      unregisterComponent(id);
    };
  }, [data, registerComponent, unregisterComponent]);

  // Sync player with global playback time
  useEffect(() => {
    if (activePlayerRef.current && globalStartTime !== null && !isSeeking.current) {
      const playerTime = currentTime / 1000; // Convert to seconds
      isSeeking.current = true;
      activePlayerRef.current.seekTo(playerTime, 'seconds');
      setTimeout(() => {
        isSeeking.current = false;
      }, 100);
    }
  }, [currentTime, globalStartTime, activePlayerRef]);

  return (
    <div className="video-playback">
      <ReactPlayer
        ref={activePlayerRef}
        playing={isPlaying}
        onPlay={play}
        onPause={pause}
        controls
        url={`${config.baseUrl}/gmaf/preview/token1/${mmfgid}`}
        width="100%"
        height="300px"
        className="rounded shadow-sm"
      />
    </div>
  );
}

export default VideoPlayback;
