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
  tagline: string
  problem: string
  solution: string
  impact: string
  github?: string
  demo?: string
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface CvData {
  skillGroups: SkillGroup[]
  coreCompetencies: string[]
  name: string
  jobTitle: string
  location: string
  phone: string
  email: string
  github: string
  linkedin: string
  softwareHouseName: string
  softwareHouseUrl: string
  yearsExp: string
  techStack: string[]
  summary: string
  workExperience: ExperienceItem[]
  education: ExperienceItem[]
  expertise: ExpertiseItem[]
  projects: ProjectItem[]
}

const ID_MONTHS: Record<string, string> = { May: 'Mei', Aug: 'Agu', Oct: 'Okt', Dec: 'Des' }

function localizePeriod(period: string, lang: Lang) {
  if (lang === 'en') return period
  return period
    .replace(/\bPresent\b/, 'Sekarang')
    .replace(/\b(May|Aug|Oct|Dec)\b/g, (m) => ID_MONTHS[m])
}

export async function getCvData(lang: Lang = 'en'): Promise<CvData> {
  const [profile, about, experienceEntries, expertiseEntries, projectEntries] = await Promise.all([
    reader.singletons.profile.read(),
    reader.singletons.about.read(),
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
        period: localizePeriod(e.entry.period ?? '', lang),
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
        period: localizePeriod(e.entry.period ?? '', lang),
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

  const projects: ProjectItem[] = projectEntries
    .filter((p) => p.entry.inCv !== false)
    .sort((a, b) => (a.entry.order ?? 99) - (b.entry.order ?? 99))
    .map((p) => {
    const l = pickLang(p.entry, lang)
    return {
      title: p.entry.title ?? '',
      tech: [...p.entry.tech],
      tagline: l.tagline ?? '',
      problem: l.problem ?? '',
      solution: l.solution ?? '',
      impact: l.impact ?? '',
      github: p.entry.github || undefined,
      demo: p.entry.demo || undefined,
    }
  })

  const aboutLang = about ? pickLang(about, lang) : undefined

  return {
    // Plain "Label: a, b, c" lines parse cleanly in ATS keyword extraction
    skillGroups: [
      { label: lang === 'en' ? 'Languages' : 'Bahasa Pemrograman', items: ['TypeScript', 'JavaScript', 'Go', 'PHP', 'Python', 'SQL'] },
      { label: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'HTML', 'CSS'] },
      { label: 'Backend', items: ['Node.js', 'Express.js', 'Laravel', 'Go (gorilla/mux)', 'REST API', 'JWT', 'WhatsApp API'] },
      { label: 'Database', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase'] },
      { label: 'Cloud & DevOps', items: ['Docker', 'AWS', 'Vercel', 'Linux', 'GitHub Actions', 'Shell Scripting', 'Git'] },
      { label: 'CMS', items: ['Payload CMS', 'Keystatic'] },
    ],
    coreCompetencies: lang === 'en' ? [
      'Fullstack End-to-End Development',
      'REST API Design',
      'Database Architecture',
      'CI/CD',
      'Cloud Deployment',
      'Unit Testing (Go testing, 85%+ coverage)',
      'Role-Based Access Control (RBAC)',
      'ETL & Data Migration',
    ] : [
      'Pengembangan Fullstack End-to-End',
      'Desain REST API',
      'Arsitektur Database',
      'CI/CD',
      'Cloud Deployment',
      'Unit Testing (Go testing, cakupan 85%+)',
      'Role-Based Access Control (RBAC)',
      'ETL & Migrasi Data',
    ],
    name: profile?.name ?? 'Mochammad Farhan Ali',
    jobTitle: lang === 'en' ? (profile?.titleEn ?? '') : (profile?.titleId ?? ''),
    location: profile?.location ?? '',
    phone: profile?.phone ?? '',
    email: profile?.email ?? '',
    github: profile?.github ?? '',
    linkedin: profile?.linkedin ?? '',
    softwareHouseName: profile?.softwareHouseName ?? '',
    softwareHouseUrl: profile?.softwareHouseUrl ?? '',
    yearsExp: profile?.yearsExp ?? '',
    techStack: [...(profile?.techStack ?? [])],
    summary: aboutLang?.description ?? '',
    workExperience,
    education,
    expertise,
    projects,
  }
}
