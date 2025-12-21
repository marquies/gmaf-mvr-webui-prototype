import React from 'react';
import ReactPlayer from 'react-player';
import config from '../../../../../../../config/config';

/**
 * Component for audio playback
 */
function AudioPlayback({ data, mmfgid, playerRef, handleSeek }) {
  return (
    <div className="audio-playback">
      <div className="audio-container p-4 bg-light rounded shadow-sm">
        <div className="text-center mb-3">
          <i className="fa fa-music fa-3x text-primary"></i>
          <h5 className="mt-2">{data?.generalMetadata?.fileName || 'Audio File'}</h5>
        </div>
        <ReactPlayer
          ref={playerRef}
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
