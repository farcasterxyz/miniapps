import { farcasterFrame, farcasterMiniApp } from './connector.js'

export * from './connector.js'

// Default export is the new name
export default farcasterMiniApp

// Also export with old name for backward compatibility
export { farcasterFrame }
