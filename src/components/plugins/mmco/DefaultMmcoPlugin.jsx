import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import config from '../../../config/config';
import { usePlayback } from '../../views/query/presentation/views/components/playback/PlaybackContext';

/**
 * Default plugin for MMCO (Multimedia Content Object) content
 */
function DefaultMmcoPlugin({ data, mmfgid, fileInfo }) {
  const { isPlaying, currentTime, startTime, setStartTime, seek } = usePlayback();
  const [mediaUrl, setMediaUrl] = useState(null);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const isSeeking = useRef(false);
  
  // Create blob URL from binary data
  useEffect(() => {
    // Clean up previous blob URL
    return () => {
      if (mediaUrl && mediaUrl.startsWith('blob:')) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [mediaUrl]);
  
  useEffect(() => {
    if (data && data instanceof Uint8Array) {
      try {
        console.log('Creating blob from Uint8Array data:', {
          length: data.length,
          mimeType: fileInfo?.mimetype || 'video/mp4'
        });
        
        // Create blob from Uint8Array
        const blob = new Blob([data], { type: fileInfo?.mimetype || 'video/mp4' });
        const url = URL.createObjectURL(blob);
        
        console.log('Created blob URL:', url, 'Blob size:', blob.size);
        setMediaUrl(url);
        setError(null);
      } catch (err) {
        console.error('Error creating blob URL:', err);
        setError('Failed to create media URL from ZIP data');
        // Fallback to remote URL
        setMediaUrl(`${config.baseUrl}/gmaf/preview/token1/${mmfgid}`);
      }
    } else if (data) {
      console.warn('Data is not Uint8Array:', typeof data);
      setError('Invalid data format');
      setMediaUrl(`${config.baseUrl}/gmaf/preview/token1/${mmfgid}`);
    } else {
      console.log('No data provided, using remote URL');
      setMediaUrl(`${config.baseUrl}/gmaf/preview/token1/${mmfgid}`);
    }
  }, [data, mmfgid, fileInfo]);
  
  // Sync player with global playback state
  useEffect(() => {
    if (playerRef.current && !isSeeking.current) {
      const playerTime = playerRef.current.getCurrentTime();
      const targetTime = currentTime / 1000; // Convert ms to seconds
      
      // Only seek if difference is significant (more than 0.5 seconds)
      if (Math.abs(playerTime - targetTime) > 0.5) {
        isSeeking.current = true;
        playerRef.current.seekTo(targetTime, 'seconds');
        setTimeout(() => {
          isSeeking.current = false;
        }, 100);
      }
    }
  }, [currentTime]);

  // Handle player progress to update global time
  const handleProgress = (state) => {
    if (!isSeeking.current && isPlaying) {
      const playerTimeMs = state.playedSeconds * 1000;
      const expectedTime = currentTime;
      
      // If player time drifts too far from expected time, sync it
      if (Math.abs(playerTimeMs - expectedTime) > 500) {
        seek(playerTimeMs);
      }
    }
  };

  // Set start time when video is ready
  const handleReady = () => {
    if (!startTime && playerRef.current) {
      const videoStartTime = Date.now();
      setStartTime(videoStartTime);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  return (
    <div className="mb-3">
      {mediaUrl && (
        <ReactPlayer
          ref={playerRef}
          url={mediaUrl}
          playing={isPlaying}
          controls={false}
          width="100%"
          height="300px"
          className="rounded shadow-sm"
          onReady={handleReady}
          onDuration={handleDuration}
          onProgress={handleProgress}
          progressInterval={100}
          onError={(e) => {
            console.error("Player error:", e);
            setError('Playback error occurred');
          }}
        />
      )}
      
      {duration > 0 && (
        <div className="mt-2 small text-muted">
          <i className="fa fa-video-camera me-1"></i>
          Duration: {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
        </div>
      )}
      
      {error && (
        <div className="alert alert-warning mt-2">
          <small>
            <i className="fa fa-exclamation-triangle me-1"></i>
            {error}
          </small>
        </div>
      )}
      
      {fileInfo && (
        <div className="mt-2 small text-muted">
          <div><strong>File:</strong> {fileInfo.path}</div>
          <div><strong>Type:</strong> {fileInfo.mimetype}</div>
        </div>
      )}
    </div>
  );
}

export default DefaultMmcoPlugin;
