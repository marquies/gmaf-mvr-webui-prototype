import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

/**
 * Plugin for displaying heartrate peripheral data
 */
function HeartratePlugin({ data, mmfgid }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const playbackIntervalRef = useRef(null);

  // For debugging - show raw data
  const rawDataDebug = useMemo(() => {
    if (!data || typeof data !== 'string') return null;
    return data.substring(0, 200);
  }, [data]);

  // Parse CSV data and extract timestamp and heart rate columns
  const parsedData = useMemo(() => {
    if (!data || typeof data !== 'string') return null;
    
    // Debug raw data
    console.log('Raw data sample:', data.substring(0, 100));
    
    // Split the CSV into rows
    const rows = data.trim().split('\n');
    if (rows.length <= 1) return null;
    
    // Parse CSV properly, handling quoted values
    const parseCSVRow = (row) => {
      const values = [];
      let inQuotes = false;
      let currentValue = '';
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"' && (i === 0 || row[i-1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue.trim());
      
      // Remove quotes from values
      return values.map(val => {
        if (val.startsWith('"') && val.endsWith('"')) {
          return val.substring(1, val.length - 1);
        }
        return val;
      });
    };
    
    // Parse header row to find timestamp and heart rate columns
    const headers = parseCSVRow(rows[0]);
    
    // Find timestamp column (assuming it's the first column)
    const timestampIndex = 0;
    
    // Find heart rate column (any column with name containing 'heart_rate')
    const heartRateIndex = headers.findIndex(header => 
      header.toLowerCase().includes('heart_rate'));
    
    if (heartRateIndex === -1) return null;
    
    // Parse data rows
    return rows.slice(1).map(row => {
      // Parse the CSV row properly, handling quoted values
      const values = parseCSVRow(row);
      
      // Get the timestamp value (already cleaned from quotes by parseCSVRow)
      let rawTimestamp = values[timestampIndex];
      
      // Make sure to remove any remaining quotes (in case our CSV parser missed them)
      if (typeof rawTimestamp === 'string') {
        // Remove any quotes that might still be present
        rawTimestamp = rawTimestamp.replace(/^"|"$/g, '');
      }
      
      let formattedDate = rawTimestamp;
      
      // For CSV data with Unix timestamps
      // First, strip any quotes and whitespace
      const cleanTimestamp = rawTimestamp.replace(/["'\s]/g, '');
      
      // Then parse as integer
      const numericValue = parseInt(cleanTimestamp, 10);
      
      if (!isNaN(numericValue)) {
        try {
          // For heartrate data, timestamps are typically in seconds
          // Convert to milliseconds for JavaScript Date
          const timestamp = numericValue * 1000;
          
          const date = new Date(timestamp);
          if (!isNaN(date.getTime())) {
            // Format the date nicely
            formattedDate = new Intl.DateTimeFormat('default', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }).format(date);
          }
        } catch (e) {
          // Keep original if parsing fails
        }
      }
      
      return {
        rawTimestamp: rawTimestamp,
        timestampMs: !isNaN(numericValue) ? numericValue * 1000 : null,
        timestamp: formattedDate,
        heartRate: values[heartRateIndex]
      };
    });
  }, [data]);
  
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!parsedData) return null;
    
    return {
      labels: parsedData.map(item => item.timestamp),
      datasets: [
        {
          label: 'Heart Rate',
          data: parsedData.map(item => Number(item.heartRate)),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.2,
        },
      ],
    };
  }, [parsedData]);
  
  // Chart options with playback marker
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Heart Rate Over Time',
      },
      annotation: {
        annotations: parsedData && currentIndex < parsedData.length ? {
          playbackLine: {
            type: 'line',
            xMin: currentIndex,
            xMax: currentIndex,
            borderColor: 'rgba(75, 192, 192, 0.8)',
            borderWidth: 2,
            label: {
              display: true,
              content: 'Current',
              position: 'start'
            }
          }
        } : {}
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Heart Rate'
        },
        min: 0
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  }), [parsedData, currentIndex]);

  // Playback control functions
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  // Playback effect with realtime timing
  useEffect(() => {
    if (isPlaying && parsedData) {
      const scheduleNext = (index) => {
        if (index >= parsedData.length - 1) {
          setIsPlaying(false);
          setCurrentIndex(parsedData.length - 1);
          return;
        }

        const currentPoint = parsedData[index];
        const nextPoint = parsedData[index + 1];
        
        // Calculate delay based on timestamp difference
        let delay = 100; // Default fallback
        if (currentPoint.timestampMs && nextPoint.timestampMs) {
          delay = nextPoint.timestampMs - currentPoint.timestampMs;
          // Cap the delay to reasonable bounds (min 10ms, max 5000ms)
          delay = Math.max(10, Math.min(delay, 5000));
        }

        playbackIntervalRef.current = setTimeout(() => {
          setCurrentIndex(index + 1);
        }, delay);
      };

      scheduleNext(currentIndex);
    } else {
      if (playbackIntervalRef.current) {
        clearTimeout(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearTimeout(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, parsedData, currentIndex]);

  return (
    <div className="heartrate-plugin">
      <h6>Heartrate Data</h6>
      <div className="alert alert-info">
        <i className="fa fa-heartbeat me-2"></i>
        Displaying heartrate data for {mmfgid}
      </div>
      
      {/* Debug section - show raw data sample */}
      <details className="mb-2">
        <summary className="small text-muted">Raw data sample (click to expand)</summary>
        <pre className="small bg-light p-2 mt-1">{rawDataDebug}</pre>
      </details>
      {data && !parsedData && (
        <div className="alert alert-warning">
          <i className="fa fa-exclamation-triangle me-2"></i>
          Could not parse CSV data. Expected format: CSV with timestamp and heart_rate columns.
        </div>
      )}
      {parsedData && (
        <div className="mt-2">
          {/* Heart Rate Chart */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Heart Rate Chart</h6>
              <div className="btn-group btn-group-sm">
                <button 
                  className={`btn ${isPlaying ? 'btn-warning' : 'btn-primary'}`}
                  onClick={handlePlayPause}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  <i className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                  {isPlaying ? ' Pause' : ' Play'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleReset}
                  title="Reset"
                  disabled={currentIndex === 0}
                >
                  <i className="fa fa-refresh"></i> Reset
                </button>
              </div>
            </div>
            <div className="small text-muted mb-2">
              Position: {currentIndex + 1} / {parsedData.length}
              {parsedData[currentIndex] && ` - ${parsedData[currentIndex].timestamp}`}
            </div>
            <div style={{ height: '300px' }}>
              {chartData && <Line data={chartData} options={chartOptions} />}
            </div>
          </div>
          
          {/* Data Table (Collapsible) */}
          <details className="mb-2">
            <summary className="small text-muted">Heart Rate Data Table (click to expand)</summary>
            <div className="table-responsive mt-2">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Heart Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.map((row, index) => (
                    <tr key={index}>
                      <td title={row.rawTimestamp}>{row.timestamp}</td>
                      <td>{row.heartRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export default HeartratePlugin;
