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
  logoUrl: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  ogImageUrl: {
    '/': OG_BASE_URL + '?title=%title&description=%description&',
    '/docs/guides':
      OG_BASE_URL + '?title=%title&description=%description&section=Guide',
    '/docs/actions':
      OG_BASE_URL + '?title=%title&description=%description&section=Action',
  },
  theme: {
    accentColor: '#8a63d2',
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
            text: 'Interacting with wallets',
            link: '/docs/guides/wallets',
          },
          {
            text: 'Sending notifications',
            link: '/docs/guides/notifications',
          },
          {
            text: 'Publishing your app',
            link: '/docs/guides/publishing',
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
            text: 'Actions',
            collapsed: true,
            items: [
              {
                text: 'addFrame',
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
            ],
          },
          {
            text: 'Wallet',
            link: '/docs/sdk/wallet',
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
