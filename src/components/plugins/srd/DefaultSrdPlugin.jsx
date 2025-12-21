import React, { useMemo, useState, useEffect, useRef } from 'react';
import { usePlayback } from '../../views/query/presentation/views/components/playback/PlaybackContext';

/**
 * Default plugin for SRD (Structured Related Data) when no specific plugin is available
 */
function DefaultSrdPlugin({ data, mmfgid, fileInfo }) {
  const { isPlaying, getAbsoluteTime, registerComponent, unregisterComponent } = usePlayback();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const componentId = useRef(`srd-${mmfgid}`);
  const logContainerRef = useRef(null);

  // Parse log data and extract timestamps
  const parsedLogs = useMemo(() => {
    if (!data || typeof data !== 'string') return null;
    
    const lines = data.trim().split('\n');
    const logs = [];
    
    // Common timestamp patterns
    const patterns = [
      // ISO 8601: 2024-03-22T10:58:27.123Z or 2024-03-22 10:58:27
      /^(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})?)/,
      // Unix timestamp: 1234567890 or 1234567890.123
      /^(\d{10,13}(?:\.\d{3})?)/,
      // Time only: 10:58:27 or 10:58:27.123
      /^(\d{2}:\d{2}:\d{2}(?:\.\d{3})?)/,
      // Bracketed timestamp: [2024-03-22 10:58:27] or [10:58:27]
      /^\[([^\]]+)\]/
    ];
    
    for (const line of lines) {
      let timestampStr = null;
      let timeOfDayMs = null;
      
      // Try each pattern
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          timestampStr = match[1];
          break;
        }
      }
      
      if (timestampStr) {
        // Parse timestamp to time-of-day
        if (/^\d{10,13}$/.test(timestampStr)) {
          // Unix timestamp
          const timestamp = parseInt(timestampStr, 10) * (timestampStr.length === 10 ? 1000 : 1);
          const date = new Date(timestamp);
          if (!isNaN(date.getTime())) {
            timeOfDayMs = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) * 1000 + date.getMilliseconds();
          }
        } else if (/^\d{2}:\d{2}:\d{2}/.test(timestampStr)) {
          // Time only format
          const parts = timestampStr.match(/^(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?/);
          if (parts) {
            const hours = parseInt(parts[1], 10);
            const minutes = parseInt(parts[2], 10);
            const seconds = parseInt(parts[3], 10);
            const ms = parts[4] ? parseInt(parts[4], 10) : 0;
            timeOfDayMs = (hours * 3600 + minutes * 60 + seconds) * 1000 + ms;
          }
        } else {
          // ISO 8601 or other date format
          const date = new Date(timestampStr);
          if (!isNaN(date.getTime())) {
            timeOfDayMs = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) * 1000 + date.getMilliseconds();
          }
        }
      }
      
      logs.push({
        line,
        timestampStr,
        timeOfDayMs
      });
    }
    
    return logs;
  }, [data]);

  // Register component time range
  useEffect(() => {
    if (parsedLogs && parsedLogs.length > 0) {
      const validLogs = parsedLogs.filter(log => log.timeOfDayMs !== null);
      if (validLogs.length > 0) {
        let startTimeMs = validLogs[0].timeOfDayMs;
        let endTimeMs = validLogs[validLogs.length - 1].timeOfDayMs;
        
        // Handle day wrap-around
        if (endTimeMs < startTimeMs) {
          endTimeMs += 24 * 3600 * 1000;
        }
        
        registerComponent(componentId.current, startTimeMs, endTimeMs);
        
        return () => {
          unregisterComponent(componentId.current);
        };
      }
    }
  }, [parsedLogs, registerComponent, unregisterComponent]);

  // Update current index based on global playback time
  useEffect(() => {
    if (!parsedLogs || parsedLogs.length === 0) return;

    const absoluteTime = getAbsoluteTime();
    
    // Find the most recent log entry at or before current time
    let newIndex = -1;
    for (let i = 0; i < parsedLogs.length; i++) {
      if (parsedLogs[i].timeOfDayMs !== null && parsedLogs[i].timeOfDayMs <= absoluteTime) {
        newIndex = i;
      } else if (parsedLogs[i].timeOfDayMs !== null && parsedLogs[i].timeOfDayMs > absoluteTime) {
        break;
      }
    }

    setCurrentIndex(newIndex);
  }, [getAbsoluteTime, parsedLogs]);

  // Auto-scroll to current log entry
  useEffect(() => {
    if (currentIndex >= 0 && logContainerRef.current) {
      const currentElement = logContainerRef.current.querySelector(`[data-log-index="${currentIndex}"]`);
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentIndex]);

  // Determine if this component is in range
  const isInRange = useMemo(() => {
    if (!parsedLogs || parsedLogs.length === 0) return false;
    const validLogs = parsedLogs.filter(log => log.timeOfDayMs !== null);
    if (validLogs.length === 0) return false;
    
    const absoluteTime = getAbsoluteTime();
    const startTimeMs = validLogs[0].timeOfDayMs;
    const endTimeMs = validLogs[validLogs.length - 1].timeOfDayMs;
    
    return absoluteTime >= startTimeMs && absoluteTime <= (endTimeMs < startTimeMs ? endTimeMs + 24 * 3600 * 1000 : endTimeMs);
  }, [parsedLogs, getAbsoluteTime]);

  return (
    <div className="default-srd-plugin">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">
          Structured Related Data
          {!isInRange && isPlaying && (
            <span className="badge bg-secondary ms-2">Inactive</span>
          )}
          {isInRange && isPlaying && (
            <span className="badge bg-success ms-2">Active</span>
          )}
        </h6>
        {currentIndex >= 0 && parsedLogs && (
          <div className="small text-muted">
            Log Entry: {currentIndex + 1} / {parsedLogs.length}
          </div>
        )}
      </div>
      {fileInfo && (
        <div className="mb-2">
          <small>
            <strong>File:</strong> {fileInfo.path}<br />
            <strong>Type:</strong> {fileInfo.mimetype}<br />
            <strong>Content Type:</strong> {fileInfo.content || 'Unknown'}
          </small>
        </div>
      )}
      {data && parsedLogs && (
        <div className="mt-2">
          <div 
            ref={logContainerRef}
            className="bg-light p-2 rounded small" 
            style={{ maxHeight: '400px', overflowY: 'auto' }}
          >
            {parsedLogs.map((log, index) => (
              <div
                key={index}
                data-log-index={index}
                className={`log-entry p-1 ${
                  index === currentIndex 
                    ? 'bg-warning text-dark fw-bold' 
                    : index < currentIndex 
                    ? 'text-muted' 
                    : ''
                }`}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  borderLeft: index === currentIndex ? '3px solid #ffc107' : 'none',
                  paddingLeft: index === currentIndex ? '8px' : '4px'
                }}
              >
                {log.line}
              </div>
            ))}
          </div>
          {parsedLogs.filter(log => log.timeOfDayMs !== null).length === 0 && (
            <div className="alert alert-warning mt-2 mb-0">
              <small>
                <i className="fa fa-exclamation-triangle me-1"></i>
                No timestamps detected in log data. Playback synchronization unavailable.
              </small>
            </div>
          )}
        </div>
      )}
      {data && !parsedLogs && (
        <div className="mt-2">
          <pre className="bg-light p-2 rounded small">
            {typeof data === 'string' ? data.substring(0, 200) + '...' : JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default DefaultSrdPlugin;
