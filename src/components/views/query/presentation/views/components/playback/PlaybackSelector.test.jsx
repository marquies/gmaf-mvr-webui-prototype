import React from 'react';
import { render, screen } from '@testing-library/react';
import PlaybackSelector from './PlaybackSelector';

jest.mock('./VideoPlayback', () => ({ mmfgid }) => <div>Video {mmfgid}</div>);
jest.mock('./AudioPlayback', () => ({ mmfgid }) => <div>Audio {mmfgid}</div>);
jest.mock('./ImagePlayback', () => ({ mmfgid }) => <div>Image {mmfgid}</div>);
jest.mock('./CmmcoPlayback', () => ({ mmfgid }) => <div>Composite {mmfgid}</div>);
beforeEach(() => { jest.spyOn(console, 'log').mockImplementation(() => {}); });

test.each([
  ['CLIP.MP4', '', 'Video'], ['sound.wav', '', 'Audio'], ['photo.jpeg', '', 'Image'],
  ['asset.cmmco', '', 'Composite'], ['stream', 'audio/mpeg', 'Audio'],
  ['stream', 'image/png', 'Image'], ['unknown.bin', '', 'Video'],
])('routes %s (%s) to %s playback', (fileName, mimeType, kind) => {
  render(<PlaybackSelector data={{ generalMetadata: { fileName, mimeType } }} mmfgid="asset-1" />);
  expect(screen.getByText(`${kind} asset-1`)).toBeInTheDocument();
});

test('uses video fallback for missing metadata', () => {
  render(<PlaybackSelector data={null} mmfgid="missing" />);
  expect(screen.getByText('Video missing')).toBeInTheDocument();
});
