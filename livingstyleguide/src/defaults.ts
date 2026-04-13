import type { StyleGuide } from './types'

export const DEFAULT_GUIDE: StyleGuide = {
  name: 'My Design System',
  description: 'A living style guide for my product.',
  colors: [
    { id: 'c1', name: 'Primary', value: '#6366f1', description: 'Brand primary — CTAs, links, focus rings' },
    { id: 'c2', name: 'Primary Light', value: '#818cf8', description: 'Hover states, highlights' },
    { id: 'c3', name: 'Background', value: '#0f0f11', description: 'App background' },
    { id: 'c4', name: 'Surface', value: '#18181b', description: 'Cards, panels' },
    { id: 'c5', name: 'Text Primary', value: '#f4f4f5', description: 'Headings, body copy' },
    { id: 'c6', name: 'Text Secondary', value: '#a1a1aa', description: 'Labels, captions' },
    { id: 'c7', name: 'Border', value: '#2e2e36', description: 'Dividers, input borders' },
    { id: 'c8', name: 'Success', value: '#22c55e', description: 'Positive states' },
    { id: 'c9', name: 'Danger', value: '#ef4444', description: 'Errors, destructive actions' },
  ],
  typography: [
    { id: 't1', name: 'Display', fontFamily: 'Inter', fontSize: '48px', fontWeight: '700', lineHeight: '1.1', description: 'Hero headings' },
    { id: 't2', name: 'H1', fontFamily: 'Inter', fontSize: '32px', fontWeight: '700', lineHeight: '1.2', description: 'Page titles' },
    { id: 't3', name: 'H2', fontFamily: 'Inter', fontSize: '24px', fontWeight: '600', lineHeight: '1.3', description: 'Section headings' },
    { id: 't4', name: 'H3', fontFamily: 'Inter', fontSize: '18px', fontWeight: '600', lineHeight: '1.4', description: 'Sub-section headings' },
    { id: 't5', name: 'Body', fontFamily: 'Inter', fontSize: '14px', fontWeight: '400', lineHeight: '1.6', description: 'Default body text' },
    { id: 't6', name: 'Small', fontFamily: 'Inter', fontSize: '12px', fontWeight: '400', lineHeight: '1.5', description: 'Captions, labels' },
    { id: 't7', name: 'Code', fontFamily: 'JetBrains Mono', fontSize: '13px', fontWeight: '400', lineHeight: '1.6', description: 'Code blocks, technical content' },
  ],
  spacing: [
    { id: 's1', name: 'xs', value: '4px', description: 'Icon gaps, tight padding' },
    { id: 's2', name: 'sm', value: '8px', description: 'Form field padding, small gaps' },
    { id: 's3', name: 'md', value: '16px', description: 'Card padding, section gaps' },
    { id: 's4', name: 'lg', value: '24px', description: 'Component spacing' },
    { id: 's5', name: 'xl', value: '32px', description: 'Section padding' },
    { id: 's6', name: '2xl', value: '48px', description: 'Page-level spacing' },
    { id: 's7', name: '3xl', value: '64px', description: 'Hero padding' },
  ],
  components: [
    { id: 'comp1', name: 'Button — Primary', description: 'High-emphasis action. Use for one primary action per view.', usage: 'CTAs: "Get started", "Save changes", "Submit"', variant: 'button' },
    { id: 'comp2', name: 'Button — Ghost', description: 'Low-emphasis secondary action.', usage: '"Cancel", "Back", secondary CTAs', variant: 'button' },
    { id: 'comp3', name: 'Input', description: 'Single-line text entry field with label and optional helper text.', usage: 'Forms, search fields, settings', variant: 'input' },
    { id: 'comp4', name: 'Badge', description: 'Small status indicator for labels, counts, and states.', usage: 'Status labels, notification counts, version tags', variant: 'badge' },
    { id: 'comp5', name: 'Card', description: 'Contained surface for grouping related content.', usage: 'Dashboard metrics, product listings, profile summaries', variant: 'card' },
  ],
}
