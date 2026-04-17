import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  managerHead: (head) =>
    head.replace(
      'content="width=device-width, initial-scale=1, maximum-scale=1"',
      'content="width=device-width, initial-scale=1"'
    ),
}

export default config
