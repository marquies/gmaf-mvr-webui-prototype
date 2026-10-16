import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

jest.mock('./components/views/queryview', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('./components/views/collectionview', () => () => <div>Collection view</div>);
const QueryView = require('./components/views/queryview').default;

beforeEach(() => {
  QueryView.mockImplementation(({ presentationView }) => <h1>Query: {presentationView}</h1>);
});

test('opens the query view with the default browse presentation', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Query: Browse View' })).toBeInTheDocument();
  expect(screen.queryByText('Collection view')).not.toBeInTheDocument();
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
});

test('shows processing progress and removes it on completion', () => {
  render(<App />);
  const { updateStatus } = QueryView.mock.calls[QueryView.mock.calls.length - 1][0];
  act(() => updateStatus(2, 4));
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '4');
  expect(screen.getByRole('progressbar')).toHaveStyle({ width: '50%' });
  act(() => updateStatus(4, 4));
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
});
