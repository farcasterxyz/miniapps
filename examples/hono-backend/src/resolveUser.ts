export async function resolveUser(fid: number) {
  const primaryAddress = await (async () => {
    const res = await fetch(
      `https://api.farcaster.xyz/fc/primary-address?fid=${fid}&protocol=ethereum`,
    )
    if (res.ok) {
      const { result } = await res.json<{
        result: {
          address: {
            fid: number
            protocol: 'ethereum' | 'solana'
            address: string
          }
        }
      }>()

      return result.address.address
    }
  })()

  return {
    fid,
    primaryAddress,
  }
}
