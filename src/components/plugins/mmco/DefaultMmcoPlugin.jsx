import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import config from '../../../config/config';
import { usePlayback } from '../../views/query/presentation/views/components/playback/PlaybackContext';

/**
 * Default plugin for MMCO (Multimedia Content Object) content
 */
function DefaultMmcoPlugin({ data, mmfgid, fileInfo }) {
  const { isPlaying, getAbsoluteTime, registerComponent, unregisterComponent } = usePlayback();
  const [mediaUrl, setMediaUrl] = useState(null);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [videoStartTime, setVideoStartTime] = useState(null);
  const componentId = useRef(`video-${mmfgid}`);
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
  
  // Register component time range when video is ready
  useEffect(() => {
    if (duration > 0 && videoStartTime !== null) {
      const endTimeMs = videoStartTime + (duration * 1000);
      registerComponent(componentId.current, videoStartTime, endTimeMs);
      
      return () => {
        unregisterComponent(componentId.current);
      };
    }
  }, [duration, videoStartTime, registerComponent, unregisterComponent]);

  // Sync player with global playback state
  useEffect(() => {
    if (playerRef.current && !isSeeking.current && videoStartTime !== null) {
      const absoluteTime = getAbsoluteTime();
      const videoRelativeTime = (absoluteTime - videoStartTime) / 1000; // Convert to seconds
      
      // Only play if we're within the video's time range
      if (videoRelativeTime >= 0 && videoRelativeTime <= duration) {
        const playerTime = playerRef.current.getCurrentTime();
        
        // Only seek if difference is significant (more than 0.5 seconds)
        if (Math.abs(playerTime - videoRelativeTime) > 0.5) {
          isSeeking.current = true;
          playerRef.current.seekTo(videoRelativeTime, 'seconds');
          setTimeout(() => {
            isSeeking.current = false;
          }, 100);
        }
      }
    }
  }, [getAbsoluteTime, videoStartTime, duration]);

  // Extract timestamp from filename (e.g., com.oculus.vrshell-20240322-105827.mp4)
  const extractTimeFromFilename = (filename) => {
    if (!filename) return null;
    
    // Match pattern: YYYYMMDD-HHMMSS
    const match = filename.match(/(\d{8})-(\d{6})/);
    if (match) {
      const timeStr = match[2]; // HHMMSS
      const hours = parseInt(timeStr.substring(0, 2), 10);
      const minutes = parseInt(timeStr.substring(2, 4), 10);
      const seconds = parseInt(timeStr.substring(4, 6), 10);
      
      // Convert to milliseconds from start of day
      return (hours * 3600 + minutes * 60 + seconds) * 1000;
    }
    return null;
  };

  // Set video start time when video is ready
  const handleReady = () => {
    if (videoStartTime === null && fileInfo?.path) {
      const timeOfDay = extractTimeFromFilename(fileInfo.path);
      if (timeOfDay !== null) {
        setVideoStartTime(timeOfDay);
      } else {
        // Fallback: use current time of day
        const now = new Date();
        const timeOfDayMs = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000;
        setVideoStartTime(timeOfDayMs);
      }
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  // Determine if video should be playing based on time range
  const shouldPlay = () => {
    if (!isPlaying || videoStartTime === null || duration === 0) return false;
    
    const absoluteTime = getAbsoluteTime();
    const videoRelativeTime = (absoluteTime - videoStartTime) / 1000;
    
    return videoRelativeTime >= 0 && videoRelativeTime <= duration;
  };

  return (
    <div className="mb-3">
      {mediaUrl && (
        <div className="position-relative">
          <ReactPlayer
            ref={playerRef}
            url={mediaUrl}
            playing={shouldPlay()}
            controls={false}
            width="100%"
            height="300px"
            className="rounded shadow-sm"
            onReady={handleReady}
            onDuration={handleDuration}
            progressInterval={100}
            onError={(e) => {
              console.error("Player error:", e);
              setError('Playback error occurred');
            }}
          />
          {!shouldPlay() && isPlaying && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{pointerEvents: 'none'}}>
              <span className="badge bg-secondary">Video Inactive</span>
            </div>
          )}
          {shouldPlay() && isPlaying && (
            <div className="position-absolute top-0 end-0 m-2" style={{pointerEvents: 'none'}}>
              <span className="badge bg-success">Active</span>
            </div>
          )}
        </div>
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
