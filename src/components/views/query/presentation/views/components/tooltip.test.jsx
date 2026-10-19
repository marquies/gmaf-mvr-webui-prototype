import React from 'react';
import { render, screen } from '@testing-library/react';
import ToolTip from './tooltip';

test('shows name, id and the metadata the service filled in', () => {
  const date = 1768735281718;
  render(<ToolTip cmmco={{ id: 'a1', generalMetadata: { fileName: 'cat.jpg', date, fileSize: 158000, width: 1271, height: 651 } }} />);
  expect(screen.getByText('name: cat.jpg')).toBeInTheDocument();
  expect(screen.getByText('id: a1')).toBeInTheDocument();
  expect(screen.getByText(`date: ${new Date(date).toLocaleString()}`)).toBeInTheDocument();
  expect(screen.getByText('size: 158 KB')).toBeInTheDocument();
  expect(screen.getByText('dimensions: 1271 × 651')).toBeInTheDocument();
});

test('skips fields the service leaves null or 0', () => {
  render(<ToolTip cmmco={{ id: 'a2', generalMetadata: { fileName: '2q7MwSJ.jpg', date: null, fileSize: 0, width: 0, height: 0 } }} />);
  expect(screen.getByText('name: 2q7MwSJ.jpg')).toBeInTheDocument();
  expect(screen.queryByText(/date:|size:|dimensions:/)).not.toBeInTheDocument();
});

test('renders no empty box when there is nothing to show', () => {
  const { container } = render(<ToolTip cmmco={{}} />);
  expect(container).toBeEmptyDOMElement();
});
