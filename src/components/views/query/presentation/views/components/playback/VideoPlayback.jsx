import React from 'react';
import ReactPlayer from 'react-player';
import config from '../../../../../../../config/config';

/**
 * Component for video playback
 */
function VideoPlayback({ data, mmfgid, playerRef, handleSeek }) {
  return (
    <div className="video-playback">
      <ReactPlayer
        ref={playerRef}
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
