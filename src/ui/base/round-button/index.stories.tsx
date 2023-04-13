import { ComponentStory, ComponentMeta } from '@storybook/react';

import { RoundButton } from './index';

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'RoundButton',
  component: RoundButton,
} as ComponentMeta<typeof RoundButton>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof RoundButton> = (args) => <RoundButton {...args} />;

export const Default = Template.bind({});

Default.args = {
  /*👇 The args you need here will depend on your component */
  children: 'TestContent',
};
