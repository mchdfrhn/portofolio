// Fixed project tag list. Keystatic's tag options and the /projects filter both derive from this.
export const PROJECT_TAGS = {
  'internal-system': { en: 'Internal system', id: 'Sistem internal' },
  website: { en: 'Website', id: 'Website' },
  'landing-page': { en: 'Landing page', id: 'Landing page' },
  client: { en: 'Client project', id: 'Proyek klien' },
} as const

export type ProjectTag = keyof typeof PROJECT_TAGS

const isProjectTag = (tag: string): tag is ProjectTag => Object.hasOwn(PROJECT_TAGS, tag)

export function tagCounts(
  items: ReadonlyArray<{ tags: readonly string[] }>,
): Array<{ tag: ProjectTag; count: number }> {
  const counts = new Map<ProjectTag, number>()
  for (const item of items) {
    for (const tag of item.tags) {
      if (isProjectTag(tag)) counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return (Object.keys(PROJECT_TAGS) as ProjectTag[])
    .filter((tag) => counts.has(tag))
    .map((tag) => ({ tag, count: counts.get(tag)! }))
}

export function resolveTag(param: string | null | undefined, available: readonly string[]): string | null {
  return param && available.includes(param) ? param : null
}
