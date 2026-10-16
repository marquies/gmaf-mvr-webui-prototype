import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '../../../../test-utils/userEvent';
import Query from './query';

jest.mock('react-tag-input');
jest.mock('./wsdquery', () => () => <div>Domain query</div>);

function setup(examples = []) {
  const props = { setCmmcoQuery: jest.fn(), similarity: jest.fn(), setFilter: jest.fn(), queryExamples: examples, onRemoveExample: jest.fn() };
  render(<Query {...props} />);
  return props;
}
const keywordInput = () => screen.getByPlaceholderText('Type and press enter or comma to add keywords');

test('submits entered keyword tags in a structured query promise', async () => {
  const props = setup();
  userEvent.type(keywordInput(), 'sea{enter}');
  userEvent.type(keywordInput(), 'sun{enter}');
  userEvent.click(screen.getByRole('button', { name: 'Query' }));
  await waitFor(() => expect(props.setCmmcoQuery).toHaveBeenCalledTimes(1));
  await expect(props.setCmmcoQuery.mock.calls[0][0]).resolves.toEqual({ srd: {}, pd: {}, md: { keywords: 'sea, sun' }, mmco: { images: [], audios: [] }, wsd: {} });
});

test('uses similarity rather than standard query when an example is selected', async () => {
  const props = setup([{ id: 'example-1', generalMetadata: { fileName: 'sea.png' } }]);
  expect(screen.getByText('sea.png')).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: 'Query' }));
  await waitFor(() => expect(props.similarity).toHaveBeenCalledWith('example-1'));
  expect(props.setCmmcoQuery).not.toHaveBeenCalled();
});

test('blocks mixed keyword/example mode with a visible warning', async () => {
  const props = setup([{ id: 'example-1' }]);
  userEvent.type(keywordInput(), 'sea{enter}');
  userEvent.click(screen.getByRole('button', { name: 'Query' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Please use either keywords OR query examples, not both');
  expect(props.similarity).not.toHaveBeenCalled();
  expect(props.setCmmcoQuery).not.toHaveBeenCalled();
});
