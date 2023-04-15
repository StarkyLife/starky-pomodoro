import { render } from '@testing-library/react';
import { RoundButton } from './index';

it('shouws content', () => {
  const { getByText } = render(
    <RoundButton>
      <div>TestContent</div>
    </RoundButton>
  );

  const content = getByText('TestContent');

  expect(content).toBeVisible();
});
