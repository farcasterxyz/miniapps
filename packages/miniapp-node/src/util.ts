export function bytesToHex(bytes: Uint8Array): string {
  return `0x${Buffer.from(bytes).toString('hex')}`
}

export function hexToBytes(hex: string): Uint8Array {
  return Uint8Array.from(
    Buffer.from(hex.startsWith('0x') ? hex.slice(2) : hex, 'hex'),
  )
}
