// Haptics types
export type ImpactOccurredType = 'light' | 'medium' | 'heavy' | 'soft' | 'rigid'
export type NotificationOccurredType = 'success' | 'warning' | 'error'

export type ImpactOccurred = (type: ImpactOccurredType) => Promise<void>
export type NotificationOccurred = (
  type: NotificationOccurredType,
) => Promise<void>
export type SelectionChanged = () => Promise<void>
