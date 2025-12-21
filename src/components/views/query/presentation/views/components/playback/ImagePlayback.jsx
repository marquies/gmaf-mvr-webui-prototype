import React, { useState } from 'react';
import config from '../../../../../../../config/config';

/**
 * Component for image playback
 */
function ImagePlayback({ data, mmfgid }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const imageUrl = `${config.baseUrl}/gmaf/preview/token1/${mmfgid}`;
  
  return (
    <div className="image-playback">
      <div className="image-container position-relative">
        <img 
          src={imageUrl}
          alt={data?.generalMetadata?.fileName || 'Image'}
          className={`img-fluid rounded shadow-sm ${isFullscreen ? 'position-fixed top-0 start-0 w-100 h-100 object-fit-contain bg-dark' : ''}`}
          style={{ 
            zIndex: isFullscreen ? 1050 : 'auto',
            cursor: 'pointer',
            maxHeight: isFullscreen ? '100vh' : '300px'
          }}
          onClick={toggleFullscreen}
        />
        {isFullscreen && (
          <button 
            className="btn btn-sm btn-light position-fixed top-0 end-0 m-2"
            onClick={toggleFullscreen}
            style={{ zIndex: 1051 }}
          >
            <i className="fa fa-times"></i> Close
          </button>
        )}
        <div className="d-flex justify-content-center mt-2">
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={toggleFullscreen}
          >
            <i className="fa fa-expand me-1"></i>
            {isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImagePlayback;
