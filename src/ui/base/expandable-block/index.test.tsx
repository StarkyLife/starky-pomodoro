import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpandableBlock } from './index';

it('initializes with hidden content', async () => {
  const { getByText } = render(
    <ExpandableBlock direction="top-bottom">TestContent</ExpandableBlock>
  );

  expect(getByText('TestContent').className).toMatch('hidden');
});

it('toggles and show content', async () => {
  const { getByTestId, getByText } = render(
    <ExpandableBlock direction="top-bottom">TestContent</ExpandableBlock>
  );

  await act(() => userEvent.click(getByTestId('expandable-block-toggler')));

  expect(getByText('TestContent').className).toMatch('visible');
});
