import { domainManifestSchema } from '@farcaster/miniapp-sdk'
import isEqual from 'lodash.isequal'
import type { z } from 'zod'

interface SchemaRendererProps {
  schema: z.ZodSchema<any>
  children: string
  title?: string
}

export function SchemaRenderer({
  schema,
  children,
  title,
}: SchemaRendererProps) {
  // Strip leading/trailing whitespace and parse JSON
  const cleanedJson = children.trim()
  const jsonData = JSON.parse(cleanedJson)

  // Validate against schema - this will throw if invalid
  const parsedData = schema.parse(jsonData)

  // Check if parsing changed the data (schema added defaults, etc)
  if (!isEqual(parsedData, jsonData)) {
    throw new Error(
      'Schema validation modified the data. Check for missing required fields or incorrect types.',
    )
  }

  return (
    <div>
      {title && <h4>{title}</h4>}
      <pre
        style={{
          backgroundColor: '#f6f8fa',
          padding: '16px',
          borderRadius: '6px',
          overflow: 'auto',
          border: '1px solid #e1e4e8',
        }}
      >
        <code>{JSON.stringify(parsedData, null, 2)}</code>
      </pre>
    </div>
  )
}

// Legacy component for backward compatibility
export function ManifestSchemaRenderer() {
  const exampleJson = `{
  "accountAssociation": {
    "header": "eyJmaWQiOjEyMTUyLCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4MEJGNDVGOTY3RTkwZmZENjA2MzVkMUFDMTk1MDYyYTNBOUZjQzYyQiJ9",
    "payload": "eyJkb21haW4iOiJ3d3cuYm91bnR5Y2FzdGVyLnh5eiJ9",
    "signature": "MHhmMTUwMWRjZjRhM2U1NWE1ZjViNGQ5M2JlNGIxYjZiOGE0ZjcwYWQ5YTE1OTNmNDk1NzllNTA2YjJkZGZjYTBlMzI4ZmRiNDZmNmVjZmFhZTU4NjYwYzBiZDc4YjgzMzc2MDAzYTkxNzhkZGIyZGIyZmM5ZDYwYjU2YTlmYzdmMDFj"
  },
  "frame": {
    "name": "Bountycaster",
    "version": "1",
    "iconUrl": "https://www.bountycaster.xyz/static/images/bounty/logo.png",
    "homeUrl": "https://www.bountycaster.xyz",
    "imageUrl": "https://www.bountycaster.xyz/static/images/bounty/logo.png",
    "buttonTitle": "Open Bounty",
    "splashImageUrl": "https://www.bountycaster.xyz/static/images/bounty/logo.png",
    "splashBackgroundColor": "#FFFFFF"
  }
}`

  return (
    <SchemaRenderer
      schema={domainManifestSchema}
      title="Example Manifest (Validated against current schema)"
    >
      {exampleJson}
    </SchemaRenderer>
  )
}
