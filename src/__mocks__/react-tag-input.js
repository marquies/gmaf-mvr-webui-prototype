import React, { useState } from 'react';

// CRA's Jest cannot import this dependency's ESM/drag-and-drop bundle.
// Keep the public tag callback contract; test application query logic, not the widget.
export function WithContext({ tags, handleAddition, handleDelete, placeholder }) {
  const [value, setValue] = useState('');
  return <div>
    <input placeholder={placeholder} value={value} onChange={event => setValue(event.target.value)} onKeyDown={event => {
      if ((event.key === 'Enter' || event.key === ',') && value.trim()) {
        event.preventDefault();
        handleAddition({ id: value.trim(), text: value.trim() });
        setValue('');
      }
    }} />
    {tags.map((tag, index) => <button key={tag.id} onClick={() => handleDelete(index)}>Remove {tag.text}</button>)}
  </div>;
}
