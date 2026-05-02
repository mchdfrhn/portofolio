import { reader } from './reader'

export type Lang = 'en' | 'id'

export interface ExperienceItem {
  title: string
  company: string
  period: string
  description: string
}

export interface ExpertiseItem {
  name: string
  tech: string[]
  description: string
}

export interface ProjectItem {
  title: string
  tech: string[]
  problem: string
  impact: string
  github?: string
}

export interface CvData {
  name: string
  jobTitle: string
  location: string
  email: string
  github: string
  linkedin: string
  yearsExp: string
  techStack: string[]
  workExperience: ExperienceItem[]
  education: ExperienceItem[]
  expertise: ExpertiseItem[]
  projects: ProjectItem[]
}

export async function getCvData(lang: Lang = 'en'): Promise<CvData> {
  const [profile, experienceEntries, expertiseEntries, projectEntries] = await Promise.all([
    reader.singletons.profile.read(),
    reader.collections.experience.all(),
    reader.collections.expertise.all(),
    reader.collections.projects.all(),
  ])

  const pickLang = <T extends { en: U; id: U }, U>(entry: T, l: Lang): U =>
    l === 'en' ? entry.en : entry.id

  const workExperience: ExperienceItem[] = experienceEntries
    .filter((e) => e.entry.type === 'work')
    .sort((a, b) => (a.entry.order ?? 99) - (b.entry.order ?? 99))
    .map((e) => {
      const l = pickLang(e.entry, lang)
      return {
        title: l.title ?? '',
        company: l.company ?? '',
        period: e.entry.period ?? '',
        description: l.description ?? '',
      }
    })

  const education: ExperienceItem[] = experienceEntries
    .filter((e) => e.entry.type === 'education')
    .sort((a, b) => (a.entry.order ?? 99) - (b.entry.order ?? 99))
    .map((e) => {
      const l = pickLang(e.entry, lang)
      return {
        title: l.title ?? '',
        company: l.company ?? '',
        period: e.entry.period ?? '',
        description: l.description ?? '',
      }
    })

  const expertise: ExpertiseItem[] = expertiseEntries
    .sort((a, b) => (a.entry.order ?? 99) - (b.entry.order ?? 99))
    .map((e) => {
      const l = pickLang(e.entry, lang)
      return {
        name: l.title ?? e.entry.name ?? '',
        tech: [...e.entry.tech],
        description: l.description ?? '',
      }
    })

  const projects: ProjectItem[] = projectEntries.map((p) => {
    const l = pickLang(p.entry, lang)
    return {
      title: p.entry.title ?? '',
      tech: [...p.entry.tech],
      problem: l.problem ?? '',
      impact: l.impact ?? '',
      github: p.entry.github || undefined,
    }
  })

  return {
    name: profile?.name ?? 'Mochamad Farhan Ali',
    jobTitle: lang === 'en' ? (profile?.titleEn ?? '') : (profile?.titleId ?? ''),
    location: profile?.location ?? '',
    email: profile?.email ?? '',
    github: profile?.github ?? '',
    linkedin: profile?.linkedin ?? '',
    yearsExp: profile?.yearsExp ?? '',
    techStack: [...(profile?.techStack ?? [])],
    workExperience,
    education,
    expertise,
    projects,
  }
}
