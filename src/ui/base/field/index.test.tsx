import { render } from '@testing-library/react';
import { Field } from './index';

it('is visible', () => {
  const { getByText } = render(<Field text="Hello" />);

  expect(getByText('Hello')).toBeVisible();
});
