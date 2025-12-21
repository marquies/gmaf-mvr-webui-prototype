import React, { useState, useEffect, useRef } from 'react';
/* global JSZip */
import config from '../../../../../../../config/config';
import MmcoPanel from './MmcoPanel';
import PdPanel from './PdPanel';
import SrdPanel from './SrdPanel';
import { PlaybackProvider, usePlayback } from './PlaybackContext';

/**
 * Global playback controls component
 */
function GlobalPlaybackControls() {
  const { isPlaying, play, pause, reset, currentTime, globalStartTime, globalEndTime } = usePlayback();

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTimeOfDay = (timeOfDayMs) => {
    if (timeOfDayMs === null || timeOfDayMs === undefined) return 'N/A';
    
    // Handle values over 24 hours (day wrap-around)
    const normalizedMs = timeOfDayMs % (24 * 3600 * 1000);
    
    const totalSeconds = Math.floor(normalizedMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalDuration = globalStartTime !== null && globalEndTime !== null 
    ? globalEndTime - globalStartTime 
    : 0;

  return (
    <div className="card mb-3 bg-primary text-white">
      <div className="card-body py-2">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h6 className="mb-0 me-3">
              <i className="fa fa-play-circle me-2"></i>
              Global Playback Control
            </h6>
            <div className="btn-group btn-group-sm">
              <button 
                className={`btn ${isPlaying ? 'btn-warning' : 'btn-light'}`}
                onClick={isPlaying ? pause : play}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                <i className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                {isPlaying ? ' Pause' : ' Play'}
              </button>
              <button 
                className="btn btn-light"
                onClick={reset}
                title="Reset"
              >
                <i className="fa fa-refresh"></i> Reset
              </button>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="small">
              <i className="fa fa-clock-o me-1"></i>
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </div>
            {globalStartTime !== null && (
              <div className="small">
                <i className="fa fa-hourglass-start me-1"></i>
                Start: {formatTimeOfDay(globalStartTime)}
              </div>
            )}
            {globalEndTime !== null && (
              <div className="small">
                <i className="fa fa-hourglass-end me-1"></i>
                End: {formatTimeOfDay(globalEndTime)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Component for CMMCO (Complex Multimedia Content Object) playback
 */
function CmmcoPlaybackContent({ data, mmfgid, playerRef, handleSeek }) {
  const [showMetadata, setShowMetadata] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manifestData, setManifestData] = useState(null);
  const [zipContents, setZipContents] = useState({});
  // Handle full-page mode toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Format timestamp to readable time
  function formatTimestampToTime(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // Padding single digits with leading zero
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }

  // Get time range information
  function getTimeRange() {
    if (!data || !data.nodes || data.nodes.length === 0) return "Unknown";

    let begin = "?";
    let end = "?";

    if (data.nodes.length > 1) {
      try {
        for (const node of data.nodes) {
          if (node.name === "shot0") {
            begin = node.timerange.begin;
            break;
          }
        }
        end = data.nodes[data.nodes.length - 1].timerange.end;
      } catch (error) {
        console.error("Error processing time range:", error);
      }
    } else if (data.nodes[0].timerange) {
      begin = data.nodes[0].timerange.begin;
      end = data.nodes[0].timerange.end;
    }

    return `${formatTimestampToTime(begin)} - ${formatTimestampToTime(end)}`;
  }

  // Function to download and process the ZIP file
  const downloadAndProcessZip = async () => {
    if (!mmfgid) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Construct the URL for downloading the ZIP file
      const zipUrl = `${config.baseUrl}/gmaf/download/token1/${mmfgid}`;
      
      // Fetch the ZIP file
      const response = await fetch(zipUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download ZIP file: ${response.statusText}`);
      }
      
      // Get the ZIP file as an ArrayBuffer
      const zipData = await response.arrayBuffer();
      
      // Use the globally available JSZip library
      const zip = new JSZip();
      
      // Load the ZIP file
      const zipContents = await zip.loadAsync(zipData);
      
      // Store all ZIP contents for potential later use
      const contents = {};
      
      // Find and read the manifest file
      let manifestFile = null;
      
      // Look for manifest.json or similar files
      for (const filename in zipContents.files) {
        if (filename.toLowerCase().includes('manifest') && filename.toLowerCase().endsWith('.json')) {
          manifestFile = filename;
          break;
        }
      }
      
      if (!manifestFile) {
        throw new Error('Manifest file not found in the ZIP archive');
      } else {
        console.log('Manifest file found:', manifestFile);
      }
      
      // Read the manifest file
      const manifestContent = await zipContents.file(manifestFile).async('text');
      
      // Parse the manifest JSON
      const manifest = JSON.parse(manifestContent);
      console.log('Parsed manifest:', manifest);
      
      // Ensure manifest is treated as an array
      //const manifestArray = Array.isArray(manifest) ? manifest : [manifest];
      setManifestData(manifest);
      
      // Process other files in the ZIP based on the manifest
      for (const filename in zipContents.files) {
        if (!zipContents.files[filename].dir) {
          // Determine the file type and read accordingly
          const fileExtension = filename.split('.').pop().toLowerCase();
          const binaryExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv', 'mp3', 'wav', 'jpg', 'jpeg', 'png', 'gif', 'pdf'];
          
          if (binaryExtensions.includes(fileExtension)) {
            // Read binary files as Uint8Array
            contents[filename] = await zipContents.files[filename].async('uint8array');
          } else {
            // Read text files as text
            contents[filename] = await zipContents.files[filename].async('text');
          }
        }
      }
      
      setZipContents(contents);
    } catch (err) {
      console.error('Error processing ZIP file:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Download and process ZIP when component mounts
  useEffect(() => {
    downloadAndProcessZip();
  }, [mmfgid]);
  
  return (
    <div 
      className={`cmmco-playback ${isFullscreen ? 'fullscreen-mode' : ''}`}
      style={isFullscreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1000,
        backgroundColor: '#fff',
        overflow: 'auto',
        padding: '20px'
      } : {}}
    >
      <GlobalPlaybackControls />
      <div className="d-flex justify-content-end mb-2">
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Full Page' : 'Enter Full Page'}
        >
          <i className={`fa ${isFullscreen ? 'fa-compress' : 'fa-expand'} me-1`}></i>
          {isFullscreen ? 'Exit Full Page' : 'Full Page Mode'}
        </button>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <p className="card-text mb-0">
            <strong>Time Range:</strong> {getTimeRange()}
          </p>
          {data.generalMetadata && (
            <p className="small text-muted mb-0">
              {data.generalMetadata.description || ''}
            </p>
          )}
        </div>
        <div>
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={() => setShowMetadata(!showMetadata)}
          >
            <i className={`fa fa-${showMetadata ? 'eye-slash' : 'eye'} me-1`}></i>
            {showMetadata ? 'Hide Metadata' : 'Show Metadata'}
          </button>
        </div>
      </div>
      
      {showMetadata && (
        <div className="metadata-panel mb-3 p-2 bg-light rounded">
          <h6 className="mb-2">Metadata</h6>
          <div className="row">
            {data.generalMetadata && Object.entries(data.generalMetadata).map(([key, value]) => (
              <div className="col-md-6 mb-1" key={key}>
                <small>
                  <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {isFullscreen ? (
        <div className="row">
          <div className="col-md-4">
            <MmcoPanel playerRef={playerRef} mmfgid={mmfgid} manifestData={manifestData} zipContents={zipContents} />
          </div>
          <div className="col-md-4">
            <PdPanel mmfgid={mmfgid} manifestData={manifestData} zipContents={zipContents} />
          </div>
          <div className="col-md-4">
            <SrdPanel mmfgid={mmfgid} manifestData={manifestData} zipContents={zipContents} />
          </div>
        </div>
      ) : (
        <>
          <MmcoPanel playerRef={playerRef} mmfgid={mmfgid} manifestData={manifestData} zipContents={zipContents} />
          <SrdPanel mmfgid={mmfgid} manifestData={manifestData} zipContents={zipContents} />
          <PdPanel mmfgid={mmfgid} manifestData={manifestData} zipContents={zipContents} />
        </>
      )}
      
      {/* Display ZIP processing status */}
      {isLoading && (
        <div className="alert alert-info mt-3">
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div>Downloading and processing CMMCO ZIP file...</div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger mt-3">
          <i className="fa fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}
      
      {/* Display manifest data if available */}
      {manifestData && (
        <div className="mt-3 p-3 border rounded bg-light">
          <h6 className="mb-3">CMMCO Manifest</h6>
          <div className="row">
            {Object.entries(manifestData).map(([key, value]) => (
              <div className="col-md-6 mb-2" key={key}>
                <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CmmcoPlayback(props) {
  return (
    <PlaybackProvider>
      <CmmcoPlaybackContent {...props} />
    </PlaybackProvider>
  );
}

export default CmmcoPlayback;
