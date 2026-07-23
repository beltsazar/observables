/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  stories: ["../**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  core: {
    builder: "@storybook/builder-vite", // 👈 The builder enabled here.
  },
  addons: [],
  framework: "@storybook/web-components-vite",
  staticDirs: ["../public"],
};
export default config;
