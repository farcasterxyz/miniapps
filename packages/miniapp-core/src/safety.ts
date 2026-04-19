/**
 * Universal Mini App identifiers (`<app-id>` in `https://farcaster.xyz/miniapps/<app-id>/<slug>`)
 * that have been reported for serious abuse (for example suspected wallet draining).
 *
 * Farcaster clients are expected to block or warn before loading these apps; this package only
 * ships a shared list so hosts, tools, and automation can stay aligned without duplicating strings.
 *
 * To add an entry: confirm with trust & safety, include the Linear issue id in a comment on the
 * row, and extend {@link REPORTED_MALICIOUS_MINI_APP_IDS}.
 */
export const REPORTED_MALICIOUS_MINI_APP_IDS = [
  // NEYN-10502 — user report: suspected drainer "clawnchpad"
  'TKmCN5l0NjbZ',
] as const

export type ReportedMaliciousMiniAppId =
  (typeof REPORTED_MALICIOUS_MINI_APP_IDS)[number]

const reportedMaliciousMiniAppIdSet = new Set<string>(
  REPORTED_MALICIOUS_MINI_APP_IDS,
)

/**
 * Returns true when the given Universal Link app id matches a known reported-malicious entry.
 */
export function isReportedMaliciousMiniAppId(appId: string): boolean {
  return reportedMaliciousMiniAppIdSet.has(appId.trim())
}
