import React from 'react';
import { render, screen } from '@testing-library/react';
import Presentation from './presentation';

jest.mock('./views/browseview', () => ({ numOfAllResults }) => <p>Browse {numOfAllResults}</p>);
jest.mock('./views/detailsview', () => () => <p>Details view</p>);

test.each(['browse', 'Browse View', undefined])('uses browse presentation for %p', presentationView => {
  render(<Presentation presentationView={presentationView} numOfAllResults={3} />);
  expect(screen.getByText('Browse 3')).toBeInTheDocument();
});

test('routes explicit details presentation', () => {
  render(<Presentation presentationView="details" />);
  expect(screen.getByText('Details view')).toBeInTheDocument();
});
