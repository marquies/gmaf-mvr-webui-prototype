import React from 'react';

/**
 * Default plugin for SRD (Structured Related Data) when no specific plugin is available
 */
function DefaultSrdPlugin({ data, mmfgid, fileInfo }) {
  return (
    <div className="default-srd-plugin">
      <h6>Structured Related Data</h6>
      <div className="alert alert-secondary">
        <i className="fa fa-info-circle me-2"></i>
        Default SRD data viewer
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

export default DefaultSrdPlugin;
