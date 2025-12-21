import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';
import config from '../../../../../../../config/config';

/**
 * Component for MMCO (Multimedia Content Object) playback panel
 */
function MmcoPanel({ playerRef, mmfgid, manifestData, zipContents }) {
  
  useEffect(() => {
    if (manifestData && Array.isArray(manifestData.files)) {
      // Find MMCO entry in manifest
      const mmcoEntry = manifestData.files.find(entry => entry.type === 'MMCO');
      
      if (mmcoEntry) {
        console.log('MMCO Panel can show:', mmcoEntry);
        console.log('MMCO file path:', mmcoEntry.path);
        console.log('MMCO mimetype:', mmcoEntry.mimetype);
        
        // If we have the content in zipContents, we could use it directly
        if (zipContents && zipContents[mmcoEntry.path]) {
          console.log('MMCO content available in zipContents');
        }
      } else {
        console.log('No MMCO entry found in manifest');
      }
    } else if (manifestData) {
      console.log('MMCO Panel: manifestData is not an array:', manifestData);
    }
  }, [manifestData, zipContents]);
  return (
    <div className="mb-3">
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

export default MmcoPanel;
