import React from 'react';

/**
 * Default plugin for peripheral data when no specific plugin is available
 */
function DefaultPdPlugin({ data, mmfgid, fileInfo }) {
  return (
    <div className="default-pd-plugin">
      <h6>Peripheral Data</h6>
      <div className="alert alert-secondary">
        <i className="fa fa-info-circle me-2"></i>
        Generic peripheral data viewer
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
          <pre className="bg-light p-2 rounded small">
            {typeof data === 'string' ? data.substring(0, 200) + '...' : JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default DefaultPdPlugin;
