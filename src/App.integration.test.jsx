import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Only the ESM-only third-party tag widget is replaced; application views are real.
jest.mock('react-tag-input');

test('renders the application query, browser and unselected details panels together', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Query Menu' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Result Browser' })).toBeInTheDocument();
  expect(screen.getByText('Select an item to view details')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Query' })).toBeEnabled();
  expect(fetch).not.toHaveBeenCalled();
});
