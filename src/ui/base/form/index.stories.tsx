import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Form } from './index';
import { Input } from '../input';

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Form',
  component: Form,
} as ComponentMeta<typeof Form>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Form> = (args) => <Form {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: <Input />,
};
