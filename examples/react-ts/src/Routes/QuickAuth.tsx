import { sdk } from '@farcaster/frame-sdk'
import { useCallback, useState } from 'react'
import { preconnect } from 'react-dom'

function QuickAuth() {
  preconnect('https://auth.farcaster.xyz')

  const [token, setToken] = useState<string>()

  const getToken = useCallback(async () => {
    const { token } = await sdk.quickAuth.getToken()
    setToken(token)
  }, [])

  return (
    <>
      <h1>sdk.quickAuth</h1>
      <button type="button" onClick={getToken}>
        getToken
      </button>
      {!!token && <code>{token}</code>}
    </>
  )
}

export default QuickAuth
