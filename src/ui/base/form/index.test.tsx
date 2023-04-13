import { render } from '@testing-library/react';
import { Form } from './index';

describe('Form', () => {
  it('is visible', () => {
    const { getByTestId } = render(<Form />);

    expect(getByTestId('form')).toBeVisible();
  });
});
