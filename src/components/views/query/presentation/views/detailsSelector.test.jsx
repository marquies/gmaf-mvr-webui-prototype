import React from 'react';
import { render, screen } from '@testing-library/react';
import DetailsSelector from './detailsSelector';
import config from '../../../../../config/config';

jest.mock('./details', () => ({ mmfgid }) => <p>Classic {mmfgid}</p>);
jest.mock('./alternativeDetails', () => ({ mmfgid }) => <p>Alternative {mmfgid}</p>);
const original = config.useAlternativeDetailsView;
afterEach(() => { config.useAlternativeDetailsView = original; });

test.each([[true, 'Alternative'], [false, 'Classic']])('routes configured alternative=%s and forwards the selected ID', (enabled, view) => {
  config.useAlternativeDetailsView = enabled;
  render(<DetailsSelector mmfgid="a" />);
  expect(screen.getByText(`${view} a`)).toBeInTheDocument();
});
