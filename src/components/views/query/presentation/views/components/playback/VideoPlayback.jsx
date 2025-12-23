import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import config from '../../../../../../../config/config';
import { usePlayback } from './PlaybackContext';

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
    if (data && data.nodes && data.nodes.length > 0) {
      // Find the time range from the data
      let startTime = null;
      let endTime = null;

      // Look for shot0 or use first node
      for (const node of data.nodes) {
        if (node.name === "shot0" && node.timerange) {
          startTime = node.timerange.begin;
          endTime = node.timerange.end;
          break;
        }
      }

      // Fallback to first node
      if (!startTime && data.nodes[0].timerange) {
        startTime = data.nodes[0].timerange.begin;
        endTime = data.nodes[0].timerange.end;
      }

      if (startTime !== null && endTime !== null) {
        registerComponent(componentId.current, startTime, endTime);
      }
    }

    return () => {
      unregisterComponent(componentId.current);
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

  const handlePlay = () => {
    console.log("Video play triggered");
    play();
  };

  const handlePause = () => {
    console.log("Video pause triggered");
    pause();
  };

  return (
    <div className="video-playback">
      <ReactPlayer
        ref={activePlayerRef}
        playing={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={(e) => console.log("onSeek", e)}
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
