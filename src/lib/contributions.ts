export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface Contributions {
  total: number
  days: ContributionDay[]
}

// Public proxy of the GitHub contribution graph (same source react-github-calendar used).
// Returns null on any failure so the page can show a fallback instead of an error.
export async function getContributions(username: string): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { total: { lastYear: number }; contributions: ContributionDay[] }
    if (!Array.isArray(data.contributions) || data.contributions.length === 0) return null
    return { total: data.total.lastYear, days: data.contributions }
  } catch {
    return null
  }
}
