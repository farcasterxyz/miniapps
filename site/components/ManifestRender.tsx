import type * as React from 'react'
import { domainManifestSchema } from '@farcaster/miniapp-sdk'
import isEqual from 'lodash.isequal'

export function ManifestSchemaRenderer() {
  // Example manifest that should be validated
  const exampleManifest = {
    accountAssociation: {
      header:
        'eyJmaWQiOjEyMTUyLCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4MEJGNDVGOTY3RTkwZmZENjA2MzVkMUFDMTk1MDYyYTNBOUZjQzYyQiJ9',
      payload: 'eyJkb21haW4iOiJ3d3cuYm91bnR5Y2FzdGVyLnh5eiJ9',
      signature:
        'MHhmMTUwMWRjZjRhM2U1NWE1ZjViNGQ5M2JlNGIxYjZiOGE0ZjcwYWQ5YTE1OTNmNDk1NzllNTA2YjJkZGZjYTBlMzI4ZmRiNDZmNmVjZmFhZTU4NjYwYzBiZDc4YjgzMzc2MDAzYTkxNzhkZGIyZGIyZmM5ZDYwYjU2YTlmYzdmMDFj',
    },
    frame: {
      name: 'Bountycaster',
      version: '1',
      iconUrl: 'https://www.bountycaster.xyz/static/images/bounty/logo.png',
      homeUrl: 'https://www.bountycaster.xyz',
      imageUrl: 'https://www.bountycaster.xyz/static/images/bounty/logo.png',
      buttonTitle: 'Open Bounty',
      splashImageUrl:
        'https://www.bountycaster.xyz/static/images/bounty/logo.png',
      splashBackgroundColor: '#FFFFFF',
    },
  }

  const parsedManifest = domainManifestSchema.parse(exampleManifest)
  const isValid = isEqual(parsedManifest, exampleManifest)

  if (!isValid) {
    throw new Error('Example manifest is not valid')
  }

  return (
    <div>
      <h4>Example Manifest (Validated against current schema)</h4>
      <pre
        style={{
          backgroundColor: '#f6f8fa',
          padding: '16px',
          borderRadius: '6px',
          overflow: 'auto',
          border: '1px solid #e1e4e8',
        }}
      >
        <code>{JSON.stringify(parsedManifest, null, 2)}</code>
      </pre>
    </div>
  )
}

export function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        textAlign: 'center',
        color: '#757575',
        fontSize: '.85rem',
        marginTop: -8,
        paddingRight: 12,
        paddingLeft: 12,
      }}
    >
      {children}
    </div>
  )
}
