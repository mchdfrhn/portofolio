import { reader } from './reader'

// How many projects the homepage gallery shows; the rest live on /projects.
export const HOME_PROJECT_LIMIT = 4

export type ProjectEntry = Awaited<ReturnType<typeof getProjects>>[number]['entry']

export async function getProjects() {
  const projects = await reader.collections.projects.all()
  return projects.sort((a, b) => (a.entry.order ?? 99) - (b.entry.order ?? 99))
}
