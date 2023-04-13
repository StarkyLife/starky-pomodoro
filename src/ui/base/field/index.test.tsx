import { render } from '@testing-library/react';
import { Field } from './index';

describe('Field', () => {
  it('is visible', () => {
    const { getByText } = render(<Field text="Hello" />);

    expect(getByText('Hello')).toBeVisible();
  });
});
