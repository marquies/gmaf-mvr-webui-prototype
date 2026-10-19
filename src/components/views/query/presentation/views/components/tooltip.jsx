import React from 'react';

function formatFileSize(bytes) {
    if (bytes >= 1000 * 1000) return (bytes / (1000 * 1000)).toFixed(1) + ' MB';
    if (bytes >= 1000) return Math.round(bytes / 1000) + ' KB';
    return bytes + ' B';
}

/**
 * Hover info for a result card. Fields the service leaves empty (null/0) are skipped.
 */
function ToolTip({ cmmco }) {
    const md = cmmco?.generalMetadata || {};
    const rows = [
        ['name', md.fileName],
        ['id', cmmco?.id],
        ['date', md.date ? new Date(md.date).toLocaleString() : null],
        ['size', md.fileSize > 0 ? formatFileSize(md.fileSize) : null],
        ['dimensions', md.width > 0 && md.height > 0 ? `${md.width} × ${md.height}` : null],
    ].filter(([, value]) => value);

    if (rows.length === 0) {
        return null;
    }

    return (
        <div className='custom-tooltip border-1 border rounded-3'>
            <div className='p-1'>
                {rows.map(([label, value]) => (
                    <div key={label} className='text-overflow-cut'>{label}: {value}</div>
                ))}
            </div>
        </div>
    );
}

export default ToolTip;
