import { config, collection, singleton, fields } from '@keystatic/core'
import { PROJECT_TAGS } from './src/lib/tags'

const tagOptions = Object.entries(PROJECT_TAGS).map(([value, label]) => ({ value, label: label.en }))

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Portfolio CMS' },
  },
  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'content/projects/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Project Title' } }),
        order: fields.integer({ label: 'Display Order', description: 'Lower number = shown first', defaultValue: 99 }),
        tags: fields.multiselect({
          label: 'Tags',
          description: 'Used by the filter on the /projects page',
          options: tagOptions,
        }),
        image: fields.image({
          label: 'Project Image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: 'Screenshot',
              directory: 'public/images/projects',
              publicPath: '/images/projects/',
            }),
            captionEn: fields.text({ label: 'Caption (EN)' }),
            captionId: fields.text({ label: 'Caption (ID)' }),
          }),
          { label: 'Gallery', itemLabel: (props) => props.fields.captionEn.value || 'Screenshot' }
        ),
        year: fields.text({ label: 'Year', description: 'e.g. 2025' }),
        inCv: fields.checkbox({ label: 'Show in CV PDF', defaultValue: true }),
        github: fields.text({ label: 'GitHub URL' }),
        demo: fields.text({ label: 'Demo URL' }),
        tech: fields.array(
          fields.text({ label: 'Technology' }),
          { label: 'Tech Stack', itemLabel: (props) => props.value }
        ),
        en: fields.object(
          {
            tagline: fields.text({ label: 'Tagline' }),
            problem: fields.text({ label: 'Problem', multiline: true }),
            solution: fields.text({ label: 'Solution', multiline: true }),
            impact: fields.text({ label: 'Impact', multiline: true }),
          },
          { label: 'English Content' }
        ),
        id: fields.object(
          {
            tagline: fields.text({ label: 'Tagline' }),
            problem: fields.text({ label: 'Problem', multiline: true }),
            solution: fields.text({ label: 'Solution', multiline: true }),
            impact: fields.text({ label: 'Impact', multiline: true }),
          },
          { label: 'Indonesian Content' }
        ),
      },
    }),

    expertise: collection({
      label: 'Expertise',
      slugField: 'name',
      path: 'content/expertise/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        order: fields.integer({ label: 'Display Order', defaultValue: 1 }),
        tech: fields.array(
          fields.text({ label: 'Technology' }),
          { label: 'Tech Tags', itemLabel: (props) => props.value }
        ),
        en: fields.object(
          {
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          },
          { label: 'English Content' }
        ),
        id: fields.object(
          {
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          },
          { label: 'Indonesian Content' }
        ),
      },
    }),

    experience: collection({
      label: 'Experience & Education',
      slugField: 'name',
      path: 'content/experience/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        type: fields.select({
          label: 'Type',
          options: [
            { label: 'Work', value: 'work' },
            { label: 'Education', value: 'education' },
          ],
          defaultValue: 'work',
        }),
        period: fields.text({ label: 'Period', description: 'e.g. 2025 - Present' }),
        order: fields.integer({ label: 'Display Order', defaultValue: 1 }),
        en: fields.object(
          {
            title: fields.text({ label: 'Title' }),
            company: fields.text({ label: 'Company / School' }),
            description: fields.text({ label: 'Description', multiline: true }),
          },
          { label: 'English Content' }
        ),
        id: fields.object(
          {
            title: fields.text({ label: 'Title' }),
            company: fields.text({ label: 'Company / School' }),
            description: fields.text({ label: 'Description', multiline: true }),
          },
          { label: 'Indonesian Content' }
        ),
      },
    }),
  },

  singletons: {
    hero: singleton({
      label: 'Hero (Intro)',
      path: 'content/hero',
      format: { data: 'yaml' },
      schema: {
        en: fields.object(
          {
            headline: fields.text({ label: 'Headline' }),
            intro: fields.text({ label: 'Intro paragraph', multiline: true }),
          },
          { label: 'English Content' }
        ),
        id: fields.object(
          {
            headline: fields.text({ label: 'Headline' }),
            intro: fields.text({ label: 'Intro paragraph', multiline: true }),
          },
          { label: 'Indonesian Content' }
        ),
        facts: fields.array(
          fields.object({
            en: fields.object({ label: fields.text({ label: 'Label' }), value: fields.text({ label: 'Value' }) }, { label: 'English' }),
            id: fields.object({ label: fields.text({ label: 'Label' }), value: fields.text({ label: 'Value' }) }, { label: 'Indonesian' }),
          }),
          {
            label: 'Quick facts',
            description: 'Rows under the intro. The "Based" row is added automatically from Profile → Location.',
            itemLabel: (props) => props.fields.en.fields.label.value,
          }
        ),
      },
    }),

    about: singleton({
      label: 'About',
      path: 'content/about',
      format: { data: 'yaml' },
      schema: {
        en: fields.object(
          {
            description: fields.text({ label: 'Short summary', description: 'Used in the CV PDF and SEO data', multiline: true }),
            story: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
              label: 'Story paragraphs',
              itemLabel: (props) => props.value.slice(0, 60),
            }),
          },
          { label: 'English Content' }
        ),
        id: fields.object(
          {
            description: fields.text({ label: 'Short summary', description: 'Used in the CV PDF and SEO data', multiline: true }),
            story: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
              label: 'Story paragraphs',
              itemLabel: (props) => props.value.slice(0, 60),
            }),
          },
          { label: 'Indonesian Content' }
        ),
        principles: fields.array(
          fields.object({
            en: fields.object(
              { title: fields.text({ label: 'Title' }), body: fields.text({ label: 'Body', multiline: true }) },
              { label: 'English' }
            ),
            id: fields.object(
              { title: fields.text({ label: 'Title' }), body: fields.text({ label: 'Body', multiline: true }) },
              { label: 'Indonesian' }
            ),
          }),
          { label: 'How I work', itemLabel: (props) => props.fields.en.fields.title.value }
        ),
      },
    }),

    contact: singleton({
      label: 'Contact',
      path: 'content/contact',
      format: { data: 'yaml' },
      schema: {
        en: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            intro: fields.text({ label: 'Intro (ends right before the email link)', multiline: true }),
          },
          { label: 'English Content' }
        ),
        id: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            intro: fields.text({ label: 'Intro (ends right before the email link)', multiline: true }),
          },
          { label: 'Indonesian Content' }
        ),
      },
    }),

    profile: singleton({
      label: 'Profile',
      path: 'content/profile',
      format: { data: 'yaml' },
      schema: {
        name: fields.text({ label: 'Full Name' }),
        titleEn: fields.text({ label: 'Job Title (EN)' }),
        titleId: fields.text({ label: 'Job Title (ID)' }),
        location: fields.text({ label: 'Location' }),
        yearsExp: fields.text({ label: 'Years of Experience', description: 'e.g. 3+' }),
        siteDescription: fields.text({ label: 'Site meta description', description: 'Default <meta description> for search and link previews', multiline: true }),
        techStack: fields.array(
          fields.text({ label: 'Technology' }),
          { label: 'Tech Stack', itemLabel: (props) => props.value }
        ),
        github: fields.text({ label: 'GitHub URL' }),
        linkedin: fields.text({ label: 'LinkedIn URL' }),
        email: fields.text({ label: 'Email Address' }),
        phone: fields.text({ label: 'Phone Number', description: 'Also used for the WhatsApp link' }),
        softwareHouseName: fields.text({ label: 'Software House Name' }),
        softwareHouseUrl: fields.text({ label: 'Software House URL' }),
      },
    }),

    cv: singleton({
      label: 'CV Extras',
      path: 'content/cv',
      format: { data: 'yaml' },
      schema: {
        skillGroups: fields.array(
          fields.object({
            en: fields.object({ label: fields.text({ label: 'Group label' }) }, { label: 'English' }),
            id: fields.object({ label: fields.text({ label: 'Group label' }) }, { label: 'Indonesian' }),
            items: fields.array(fields.text({ label: 'Skill' }), { label: 'Skills', itemLabel: (props) => props.value }),
          }),
          { label: 'Skill groups (CV PDF)', itemLabel: (props) => props.fields.en.fields.label.value }
        ),
        coreCompetencies: fields.array(
          fields.object({
            en: fields.text({ label: 'English' }),
            id: fields.text({ label: 'Indonesian' }),
          }),
          { label: 'Core competencies (CV PDF)', itemLabel: (props) => props.fields.en.value }
        ),
      },
    }),
  },
})
