export interface ColorToken {
  id: string
  name: string
  value: string
  description: string
}

export interface TypographyToken {
  id: string
  name: string
  fontFamily: string
  fontSize: string
  fontWeight: string
  lineHeight: string
  description: string
}

export interface SpacingToken {
  id: string
  name: string
  value: string
  description: string
}

export interface ComponentDoc {
  id: string
  name: string
  description: string
  usage: string
  variant: 'button' | 'input' | 'badge' | 'card' | 'custom'
}

export interface StyleGuide {
  name: string
  description: string
  colors: ColorToken[]
  typography: TypographyToken[]
  spacing: SpacingToken[]
  components: ComponentDoc[]
}

export type ActiveSection = 'colors' | 'typography' | 'spacing' | 'components'
