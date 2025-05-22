import { defineConfig } from 'vocs'

const PRODUCTION_URL = 'https://deodad-frames.vercel.app'
const OG_BASE_URL = 'https://og-five-eta.vercel.app/api/og/mini-apps'

export default defineConfig({
  baseUrl: process.env.VERCEL_URL ?? PRODUCTION_URL,
  font: {
    google: 'Inter',
  },
  rootDir: '.',
  title: 'Farcaster Mini Apps',
  titleTemplate: '%s · Farcaster Mini Apps',
  editLink: {
    pattern:
      'https://github.com/farcasterxyz/frames/edit/main/site/pages/:path',
    text: 'Edit on GitHub',
  },
  iconUrl: '/favicon.png',
  logoUrl: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  head() {
    return (
      <>
        <script
          src="https://cdn.usefathom.com/script.js"
          data-site="FJKRBMZB"
          defer
        />
      </>
    )
  },
  ogImageUrl: {
    '/': OG_BASE_URL + '?title=%title&description=%description&',
    '/docs/guides':
      OG_BASE_URL + '?title=%title&description=%description&section=Guide',
    '/docs/sdk':
      OG_BASE_URL + '?title=%title&description=%description&section=SDK',
    '/docs/sdk/actions':
      OG_BASE_URL + '?title=%title&description=%description&section=Action',
  },
  theme: {
    accentColor: '#8a63d2',
  },
  search: {
    boostDocument(documentId) {
      if (documentId.startsWith('pages/docs')) return 3
      if (documentId.startsWith('pages/docs/specification')) return 2
      return 1
    },
  },
  topNav: [
    {
      text: 'Examples',
      link: 'https://github.com/farcasterxyz/frames/tree/main/examples',
    },
    { text: 'Rewards', link: 'https://warpcast.com/~/developers/rewards' },
  ],
  sidebar: {
    '/': [
      {
        text: 'Introduction',
        items: [
          {
            text: 'Why Mini Apps?',
            link: '/',
          },
          {
            text: 'Getting Started',
            link: '/docs/getting-started',
          },
        ],
      },
      {
        text: 'Guides',
        items: [
          {
            text: 'Loading your app',
            link: '/docs/guides/loading',
          },
          {
            text: 'Sharing your app',
            link: '/docs/guides/sharing',
          },
          {
            text: 'Interacting with Ethereum wallets',
            link: '/docs/guides/wallets',
          },
          {
            text: 'Interacting with Solana wallets',
            link: '/docs/guides/solana',
          },
          {
            text: 'Publishing your app',
            link: '/docs/guides/publishing',
          },
          {
            text: 'Sending notifications',
            link: '/docs/guides/notifications',
          },
          {
            text: 'Authenticating users',
            link: '/docs/guides/auth',
          },
        ],
      },
      {
        text: 'SDK',
        items: [
          {
            text: "What's New",
            link: '/docs/sdk/changelog',
          },
          {
            text: 'Context',
            link: '/docs/sdk/context',
          },
          {
            text: 'Mini app detection',
            link: '/docs/sdk/is-in-mini-app',
          },
          {
            text: 'Detecting chains & capabilities',
            link: '/docs/sdk/detecting-capabilities',
          },
          {
            text: 'Actions',
            collapsed: true,
            items: [
              {
                text: 'addMiniApp',
                link: '/docs/sdk/actions/add-frame',
              },
              {
                text: 'close',
                link: '/docs/sdk/actions/close',
              },
              {
                text: 'composeCast',
                link: '/docs/sdk/actions/compose-cast',
              },
              {
                text: 'ready',
                link: '/docs/sdk/actions/ready',
              },
              {
                text: 'openUrl',
                link: '/docs/sdk/actions/open-url',
              },
              {
                text: 'signIn',
                link: '/docs/sdk/actions/sign-in',
              },
              {
                text: 'viewProfile',
                link: '/docs/sdk/actions/view-profile',
              },
              {
                text: 'swapToken',
                link: '/docs/sdk/actions/swap-token',
              },
              {
                text: 'sendToken',
                link: '/docs/sdk/actions/send-token',
              },
              {
                text: 'quickAuth (experimental)',
                link: '/docs/sdk/actions/quick-auth',
              },
              {
                text: 'viewToken',
                link: '/docs/sdk/actions/view-token',
              },
            ],
          },
          {
            text: 'Ethereum wallet',
            link: '/docs/sdk/wallet',
          },
          {
            text: 'Solana wallet',
            link: '/docs/sdk/solana',
          },
          {
            text: 'Events',
            link: '/docs/sdk/events',
          },
        ],
      },
      {
        text: 'Reference',
        collapsed: true,
        items: [
          {
            text: 'Specification',
            link: '/docs/specification',
          },
          {
            text: 'Warpcast Intents',
            link: 'https://docs.farcaster.xyz/reference/warpcast/cast-composer-intents',
          },
        ],
      },
    ],
  },
  socials: [
    {
      icon: 'github',
      link: 'https://github.com/farcasterxyz/frames',
    },
    {
      icon: 'x',
      link: 'https://x.com/farcaster_xyz',
    },
  ],
})
