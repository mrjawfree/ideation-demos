import type { Meta, StoryObj } from '@storybook/react'
import { SpiceScaleCalculator } from './SpiceScaleCalculator'

const meta: Meta<typeof SpiceScaleCalculator> = {
  title: 'SpiceScale/Calculator',
  component: SpiceScaleCalculator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'Recipe batch-scaling calculator with smart sublinear scaling for intense ingredients. Select a recipe and adjust the batch multiplier to see how each ingredient scales.',
      },
    },
  },
  argTypes: {
    recipeId: {
      control: 'select',
      options: ['bbq-dry-rub', 'hot-sauce', 'bbq-sauce'],
      description: 'Pre-loaded recipe to display',
    },
    multiplier: {
      control: { type: 'range', min: 1, max: 10, step: 0.5 },
      description: 'Batch multiplier for scaling',
    },
  },
}

export default meta
type Story = StoryObj<typeof SpiceScaleCalculator>

export const Default: Story = {
  args: {
    recipeId: 'bbq-dry-rub',
    multiplier: 1,
  },
}

export const ScaledUp: Story = {
  name: '5x Batch',
  args: {
    recipeId: 'bbq-dry-rub',
    multiplier: 5,
  },
}

export const HotSauce: Story = {
  args: {
    recipeId: 'hot-sauce',
    multiplier: 3,
  },
}

export const CustomIngredients: Story = {
  name: 'Custom Ingredients',
  args: {
    multiplier: 2,
    ingredients: [
      { name: 'Habanero Flakes', base: 2, unit: 'tbsp', scaling: 'sublinear' as const },
      { name: 'Sea Salt', base: 1, unit: 'tsp', scaling: 'sublinear' as const },
      { name: 'Lime Juice', base: 3, unit: 'tbsp', scaling: 'linear' as const },
      { name: 'Mango Puree', base: 4, unit: 'tbsp', scaling: 'linear' as const },
    ],
  },
}
