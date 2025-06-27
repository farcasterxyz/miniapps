export function bytesToHex(bytes) {
    return `0x${Buffer.from(bytes).toString('hex')}`;
}
export function hexToBytes(hex) {
    return Uint8Array.from(Buffer.from(hex.startsWith('0x') ? hex.slice(2) : hex, 'hex'));
}
