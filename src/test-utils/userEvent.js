import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// user-event 13's synchronous API needs an explicit React 18 act boundary.
const interactions = {};
['click', 'type', 'clear', 'upload'].forEach(method => {
  interactions[method] = (...args) => {
    let value;
    act(() => { value = userEvent[method](...args); });
    return value;
  };
});
export default interactions;
