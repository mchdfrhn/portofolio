import { reader } from './reader'

export async function getProjects() {
  const projects = await reader.collections.projects.all()
  return projects.sort((a, b) => (a.entry.order ?? 99) - (b.entry.order ?? 99))
}
