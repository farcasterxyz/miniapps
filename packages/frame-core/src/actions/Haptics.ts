export type ImpactOccurred = (
  type: 'light' | 'medium' | 'heavy' | 'soft' | 'rigid',
) => Promise<void>

export type NotificationOccurred = (
  type: 'success' | 'warning' | 'error',
) => Promise<void>

export type SelectionChanged = () => Promise<void>
