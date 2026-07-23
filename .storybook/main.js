/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  stories: ["../**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: "@storybook/web-components-vite",
  previewHead: head => `
    ${head}
       <script
      defer
      type="module"
      src="/scoped-custom-element-registry.min.js"
    ></script>
  `,
  staticDirs: ["../public"],
};
export default config;
