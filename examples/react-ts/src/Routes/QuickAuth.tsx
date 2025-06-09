import { sdk } from '@farcaster/frame-sdk'
import { useCallback, useState } from 'react'
import { preconnect } from 'react-dom'

function QuickAuth() {
  preconnect('https://auth.farcaster.xyz')

  return (
    <>
      <h1>sdk.quickAuth</h1>
      <GetToken />
      <div style={{ marginTop: 10 }}>
        <Fetch />
      </div>
    </>
  )
}

function GetToken() {
  const [token, setToken] = useState<string>()

  const getToken = useCallback(async () => {
    const { token } = await sdk.quickAuth.getToken()
    setToken(token)
  }, [])

  return (
    <div>
      <button type="button" onClick={getToken}>
        getToken
      </button>
      {!!token && (
        <div>
          <code>{token}</code>
        </div>
      )}
    </div>
  )
}

function Fetch() {
  const [user, setUser] = useState<any>()

  const fetch = useCallback(async () => {
    const res = await sdk.quickAuth.fetch('http://localhost:8787/me')
    if (res.ok) {
      setUser(await res.json())
    }
  }, [])

  return (
    <div>
      <button type="button" onClick={fetch}>
        fetch
      </button>
      {!!user && (
        <div>
          <code style={{ whiteSpace: 'pre' }}>
            {JSON.stringify(user, null, 2)}
          </code>
        </div>
      )}
    </div>
  )
}

export default QuickAuth
