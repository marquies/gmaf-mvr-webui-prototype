import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import config from '../../../../../../../config/config';
import { usePlayback } from './PlaybackContext';

/**
 * Component for audio playback
 */
function AudioPlayback({ data, mmfgid, playerRef, handleSeek }) {
  const { registerComponent, unregisterComponent, currentTime, globalStartTime, isPlaying, play, pause } = usePlayback();
  const componentId = useRef(`audio-${mmfgid}`);
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
    console.log("Audio play triggered");
    play();
  };

  const handlePause = () => {
    console.log("Audio pause triggered");
    pause();
  };

  return (
    <div className="audio-playback">
      <div className="audio-container p-4 bg-light rounded shadow-sm">
        <div className="text-center mb-3">
          <i className="fa fa-music fa-3x text-primary"></i>
          <h5 className="mt-2">{data?.generalMetadata?.fileName || 'Audio File'}</h5>
        </div>
        <ReactPlayer
          ref={activePlayerRef}
          playing={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onSeek={(e) => console.log("onSeek", e)}
          controls
          height="50px"
          width="100%"
          url={`${config.baseUrl}/gmaf/preview/token1/${mmfgid}`}
          config={{
            file: {
              forceAudio: true
            }
          }}
        />
      </div>
    </div>
  );
}

export default AudioPlayback;
