const paddedHexBuffer = (hex, pad) =>
  Buffer.from(hex.padStart(pad * 2, 0), "hex")

export const addressBuffer = addr => paddedHexBuffer(addr, 8)
