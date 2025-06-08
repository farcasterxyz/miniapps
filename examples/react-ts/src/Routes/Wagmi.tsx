import { farcasterFrame as frameConnector } from '@farcaster/frame-wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useAccount, useConnect, useSignMessage } from 'wagmi'
import { config } from '../wagmiConfig.ts'

const queryClient = new QueryClient()

function Wagmi() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WagmiInner />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function WagmiInner() {
  return (
    <>
      <div>Simple Wagmi React Frame Example</div>
      <ConnectMenu />
    </>
  )
}

function ConnectMenu() {
  const { isConnected, address } = useAccount()
  const { connect } = useConnect()

  if (isConnected) {
    return (
      <>
        <div>Connected account:</div>
        <div>{address}</div>
        <SignButton />
      </>
    )
  }

  return (
    <button
      type="button"
      onClick={() => connect({ connector: frameConnector() })}
    >
      Connect
    </button>
  )
}

function SignButton() {
  const { signMessage, isPending, data, error } = useSignMessage()

  return (
    <>
      <button
        type="button"
        onClick={() => signMessage({ message: 'hello world' })}
        disabled={isPending}
      >
        {isPending ? 'Signing...' : 'Sign message'}
      </button>
      {data && (
        <>
          <div>Signature</div>
          <div>{data}</div>
        </>
      )}
      {error && (
        <>
          <div>Error</div>
          <div>{error.message}</div>
        </>
      )}
    </>
  )
}

export default Wagmi
