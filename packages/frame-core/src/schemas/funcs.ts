import { z } from 'zod'

const isUrlEncoded = (val: string): boolean => {
  if (val === '') return true
  try {
    return encodeURIComponent(decodeURIComponent(val)) === val
  } catch (e) {
    return false
  }
}

export const sharedStateSchema = z.object({
  path: z
    .string()
    .refine(
      (pathStr) => {
        if (pathStr === '') return true
        if (!pathStr.startsWith('/')) return false
        if (pathStr.includes('?') || pathStr.includes('#')) return false

        if (pathStr === '/') {
          return true
        }

        const segments = pathStr.substring(1).split('/')
        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i]
          if (segment === '') {
            if (i < segments.length - 1) {
              return false
            }
            return true
          }
          if (!isUrlEncoded(segment)) {
            return false
          }
        }
        return true
      },
      {
        message:
          'Path must be a valid URL-encoded path string, starting with / (e.g., /foo/bar), or an empty string. Consecutive slashes (e.g., /foo//bar) are not allowed.',
      },
    )
    .optional(),
  params: z
    .union([
      z.record(z.string(), z.string()),
      z.string().refine(
        (queryStr) => {
          const str = queryStr.startsWith('?')
            ? queryStr.substring(1)
            : queryStr
          if (str === '') return true

          if (str.includes('&&')) {
            if (str !== '&&') return false
          }

          const pairs = str.split('&')

          for (const pair of pairs) {
            const parts = pair.split('=', 2)
            const key = parts[0]

            if (!isUrlEncoded(key)) return false

            if (parts.length > 1) {
              const value = parts[1]
              if (!isUrlEncoded(value)) return false
            }
          }
          return true
        },
        {
          message:
            "Query string must be a valid URL-encoded query string (e.g., 'foo=bar%20baz&key=val' or '?name=value'). Both keys and values must be URL-encoded.",
        },
      ),
      z.array(z.array(z.string())),
    ])
    .optional(),
})
