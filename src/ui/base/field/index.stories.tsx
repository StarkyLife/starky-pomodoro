import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Field } from './index';
import { Input } from '../input';

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Field',
  component: Field,
} as ComponentMeta<typeof Field>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Field> = (args) => <Field {...args} />;

export const Default = Template.bind({});

Default.args = {
  text: 'Field Label',
  children: <Input />,
};
