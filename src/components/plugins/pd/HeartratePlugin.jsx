import React from 'react';

/**
 * Plugin for displaying heartrate peripheral data
 */
function HeartratePlugin({ data, mmfgid }) {
  return (
    <div className="heartrate-plugin">
      <h6>Heartrate Data</h6>
      <div className="alert alert-info">
        <i className="fa fa-heartbeat me-2"></i>
        Displaying heartrate data for {mmfgid}
      </div>
      {data && (
        <div className="mt-2">
          <pre className="bg-light p-2 rounded small">
            {typeof data === 'string' ? data.substring(0, 200) + '...' : JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default HeartratePlugin;
