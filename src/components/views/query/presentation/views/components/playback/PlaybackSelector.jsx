import React from 'react';
import VideoPlayback from './VideoPlayback';
import AudioPlayback from './AudioPlayback';
import ImagePlayback from './ImagePlayback';
import CmmcoPlayback from './CmmcoPlayback';

/**
 * Component that selects the appropriate playback component based on file type
 */
function PlaybackSelector({ data, mmfgid, playerRef, handleSeek }) {
  // Helper function to determine file type from filename or MIME type
  const getFileType = () => {
    if (!data || !data.generalMetadata || !data.generalMetadata.fileName) {
      return 'unknown';
    }
    
    const fileName = data.generalMetadata.fileName.toLowerCase();
    const mimeType = data.generalMetadata.mimeType || '';
    
    // Check if it's a CMMCO object with specific structure
    if (fileName.endsWith('.cmmco')) {
      return 'cmmco';
    }
    
    // Check for video files
    if (
      fileName.endsWith('.mp4') || 
      fileName.endsWith('.webm') || 
      fileName.endsWith('.ogg') || 
      fileName.endsWith('.mov') ||
      mimeType.startsWith('video/')
    ) {
      return 'video';
    }
    
    // Check for audio files
    if (
      fileName.endsWith('.mp3') || 
      fileName.endsWith('.wav') || 
      fileName.endsWith('.ogg') || 
      fileName.endsWith('.aac') ||
      mimeType.startsWith('audio/')
    ) {
      return 'audio';
    }
    
    // Check for image files
    if (
      fileName.endsWith('.jpg') || 
      fileName.endsWith('.jpeg') || 
      fileName.endsWith('.png') || 
      fileName.endsWith('.gif') || 
      fileName.endsWith('.webp') ||
      mimeType.startsWith('image/')
    ) {
      return 'image';
    }
    
    // Default to video if we can't determine
    return 'video';
  };

  // Get the file type
  const fileType = getFileType();
  console.log("File Type: ", fileType);
  
  // Render the appropriate component based on file type
  switch (fileType) {
    case 'cmmco':
      return <CmmcoPlayback data={data} mmfgid={mmfgid} playerRef={playerRef} handleSeek={handleSeek} />;
    case 'video':
      return <VideoPlayback data={data} mmfgid={mmfgid} playerRef={playerRef} handleSeek={handleSeek} />;
    case 'audio':
      return <AudioPlayback data={data} mmfgid={mmfgid} playerRef={playerRef} handleSeek={handleSeek} />;
    case 'image':
      return <ImagePlayback data={data} mmfgid={mmfgid} />;
    default:
      return <VideoPlayback data={data} mmfgid={mmfgid} playerRef={playerRef} handleSeek={handleSeek} />;
  }
}

export default PlaybackSelector;
