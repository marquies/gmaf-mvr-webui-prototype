import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import config from '../../../config/config';

/**
 * Default plugin for MMCO (Multimedia Content Object) content
 */
function DefaultMmcoPlugin({ data, mmfgid, fileInfo }) {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [error, setError] = useState(null);
  
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
  
  return (
    <div className="mb-3">
      {mediaUrl && (
        <ReactPlayer
          url={mediaUrl}
          controls
          width="100%"
          height="300px"
          className="rounded shadow-sm"
          onError={(e) => {
            console.error("Player error:", e);
            setError('Playback error occurred');
          }}
        />
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
