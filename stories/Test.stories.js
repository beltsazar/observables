import { html } from "lit";
import "../packages/example-feature/src/feature-component.js";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Example/Full Feature",
  render: () => html`
    <feature-component heading="Product selector 1"></feature-component>
  `,
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    primary: true,
    label: "Button",
  },
};
