import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Input } from './index';

describe('Input', () => {
  it('is visible', () => {
    const { getByTestId } = render(<Input />);

    expect(getByTestId('input')).toBeVisible();
  });

  it('notifies about value change', async () => {
    const Container: React.FC = () => {
      const [value, setValue] = useState('initial');
      return (
        <>
          <span data-testid="valueId">{value}</span>
          <Input value={value} onChange={setValue} />
        </>
      );
    };

    const { findByTestId, getByTestId } = render(<Container />);

    await userEvent.type(getByTestId('input'), ' updated');

    const valueHolder = await findByTestId('valueId');
    expect(valueHolder).toHaveTextContent('initial update');
  });
});
