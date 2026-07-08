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

export interface CvData {
  keyAchievements: string[]
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
    keyAchievements: lang === 'en' ? [
      'Architected and shipped SIPEKAD academic information system serving 1,000+ students across 5 departments',
      'Built Python + SQL ETL pipeline processing 5,000+ government employee records, reducing migration from weeks to hours',
      'Deployed 3 production Next.js applications with Docker + CI/CD, serving institutional and government clients',
    ] : [
      'Mengarsiteki dan mengirimkan sistem informasi akademik SIPEKAD yang melayani 1.000+ mahasiswa di 5 departemen',
      'Membangun pipeline ETL Python + SQL yang memproses 5.000+ data pegawai pemerintah, memangkas migrasi dari minggu ke jam',
      'Mendeploy 3 aplikasi Next.js produksi dengan Docker + CI/CD, melayani klien institusi dan pemerintah',
    ],
    name: profile?.name ?? 'Mochamad Farhan Ali',
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
