import { sdk } from '@farcaster/frame-sdk'
import { useEffect } from 'react'
import { NavLink, Route, Routes } from 'react-router'
import QuickAuth from './Routes/QuickAuth.tsx'
import Wagmi from './Routes/Wagmi.tsx'

function App() {
  useEffect(() => {
    sdk.actions.ready()
    sdk.back.enableWebNavigation()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quick-auth" element={<QuickAuth />} />
      <Route path="/wagmi" element={<Wagmi />} />
    </Routes>
  )
}

function Home() {
  return (
    <>
      <NavLink to="/quick-auth" style={{ display: 'block' }}>
        Quick Auth
      </NavLink>
      <NavLink to="/wagmi" style={{ display: 'block' }} end>
        Wagmi
      </NavLink>
    </>
  )
}

export default App
