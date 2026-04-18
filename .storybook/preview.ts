import type { Preview } from '@storybook/react'
import '../livingstyleguide/src/index.css'
import '../livingstyleguide/src/App.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f0f11' },
        { name: 'surface', value: '#18181b' },
        { name: 'elevated', value: '#1f1f23' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: undefined,
    },
  },
}

export default preview
