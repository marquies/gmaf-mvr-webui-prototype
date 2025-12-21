import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePlayback } from '../../views/query/presentation/views/components/playback/PlaybackContext';

/**
 * Extracts Unity lines and Scene Graph content from RSG data
 */
function RsgDataViewer({ data, mmfgid }) {
  const { isPlaying, getAbsoluteTime, registerComponent, unregisterComponent } = usePlayback();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const componentId = useRef(`rsg-${mmfgid}`);
  const parseRsgData = (rawData) => {
    const text = typeof rawData === 'string' ? rawData : JSON.stringify(rawData, null, 2);
    const lines = text.split('\n');
    
    const unityLines = [];
    const sceneGraphs = [];
    let inSceneGraph = false;
    let currentSceneGraph = [];
    let currentTimestamp = null;
    
    for (const line of lines) {
      if (line.includes('Unity')) {
        unityLines.push(line);
      }
      
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('start scene graph')) {
        inSceneGraph = true;
        currentSceneGraph = [];
        
        // Extract timestamp from the line - format: HH:MM:SS.mmm
        const timestampMatch = line.match(/^(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
        if (timestampMatch) {
          const hours = parseInt(timestampMatch[1]);
          const minutes = parseInt(timestampMatch[2]);
          const seconds = parseInt(timestampMatch[3]);
          const milliseconds = parseInt(timestampMatch[4]);
          
          // Convert to time of day in milliseconds
          currentTimestamp = (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
        } else {
          currentTimestamp = null;
        }
        continue;
      }
      
      if (lowerLine.includes('end scene graph')) {
        inSceneGraph = false;
        if (currentSceneGraph.length > 0) {
          sceneGraphs.push({
            timestamp: currentTimestamp,
            lines: currentSceneGraph
          });
          currentSceneGraph = [];
          currentTimestamp = null;
        }
        continue;
      }
      
      if (inSceneGraph) {
        currentSceneGraph.push(line);
      }
    }
    
    return { unityLines, sceneGraphs };
  };
  
  const { unityLines, sceneGraphs } = parseRsgData(data);
  
  // Register component time range when scene graphs are loaded
  useEffect(() => {
    if (sceneGraphs && sceneGraphs.length > 0) {
      const validGraphs = sceneGraphs.filter(sg => sg.timestamp !== null);
      if (validGraphs.length > 0) {
        const startTimeMs = validGraphs[0].timestamp;
        const endTimeMs = validGraphs[validGraphs.length - 1].timestamp;
        
        registerComponent(componentId.current, startTimeMs, endTimeMs);
        
        return () => {
          unregisterComponent(componentId.current);
        };
      }
    }
  }, [sceneGraphs, registerComponent, unregisterComponent]);

  // Update selected scene graph based on global absolute time
  useEffect(() => {
    if (!sceneGraphs || sceneGraphs.length === 0) return;

    const absoluteTime = getAbsoluteTime();

    // Find the scene graph that corresponds to this absolute timestamp
    let newIndex = 0;
    for (let i = 0; i < sceneGraphs.length; i++) {
      if (sceneGraphs[i].timestamp && sceneGraphs[i].timestamp <= absoluteTime) {
        newIndex = i;
      } else {
        break;
      }
    }

    setSelectedIndex(newIndex);
  }, [getAbsoluteTime, sceneGraphs]);

  // Determine if this component should be active based on time range
  const isInRange = useMemo(() => {
    if (!sceneGraphs || sceneGraphs.length === 0) return false;
    const validGraphs = sceneGraphs.filter(sg => sg.timestamp !== null);
    if (validGraphs.length === 0) return false;
    
    const absoluteTime = getAbsoluteTime();
    const startTimeMs = validGraphs[0].timestamp;
    const endTimeMs = validGraphs[validGraphs.length - 1].timestamp;
    
    return absoluteTime >= startTimeMs && absoluteTime <= endTimeMs;
  }, [sceneGraphs, getAbsoluteTime]);
  
  return (
    <div>
      {sceneGraphs.length > 0 ? (
        <div>
          {/* Timeline */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">
                Scene Graph Timeline ({sceneGraphs.length})
                {!isInRange && isPlaying && (
                  <span className="badge bg-secondary ms-2">Inactive</span>
                )}
                {isInRange && isPlaying && (
                  <span className="badge bg-success ms-2">Active</span>
                )}
              </h6>
            </div>
            <div className="d-flex flex-wrap gap-2 p-2 bg-light rounded">
              {sceneGraphs.map((sceneGraph, index) => (
                <button
                  key={index}
                  className={`btn btn-sm ${selectedIndex === index ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedIndex(index)}
                  title={sceneGraph.timestamp ? `Timestamp: ${sceneGraph.timestamp}` : 'No timestamp'}
                >
                  <div className="d-flex flex-column align-items-center">
                    <small className="fw-bold">#{index + 1}</small>
                    {sceneGraph.timestamp && (
                      <small style={{ fontSize: '0.7rem' }}>{sceneGraph.timestamp}</small>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Selected Scene Graph */}
          {sceneGraphs[selectedIndex] && (
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <span className="badge bg-primary me-2">Scene Graph {selectedIndex + 1}</span>
                {sceneGraphs[selectedIndex].timestamp && (
                  <span className="badge bg-secondary me-2">
                    <i className="fa fa-clock me-1"></i>
                    {sceneGraphs[selectedIndex].timestamp}
                  </span>
                )}
                <small className="text-muted">{sceneGraphs[selectedIndex].lines.length} lines</small>
              </div>
              <pre className="bg-light p-3 rounded small" style={{ maxHeight: '500px', overflow: 'auto' }}>
                {sceneGraphs[selectedIndex].lines.join('\n')}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="alert alert-warning">
          <i className="fa fa-exclamation-triangle me-2"></i>
          No Scene Graph data found
        </div>
      )}
    </div>
  );
}

/**
 * Default plugin for peripheral data when no specific plugin is available
 */
function RSGPlugin({ data, mmfgid, fileInfo }) {
  return (
    <div className="default-pd-plugin">
      <h6>SRD Data</h6>
      <div className="alert alert-secondary">
        <i className="fa fa-info-circle me-2"></i>
        Generic RSG data viewer
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
      {data && (
        <div className="mt-2">
          <RsgDataViewer data={data} mmfgid={mmfgid} />
        </div>
      )}
    </div>
  );
}

export default RSGPlugin;
