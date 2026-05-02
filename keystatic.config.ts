import { config, collection, singleton, fields } from '@keystatic/core'

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
        icon: fields.select({
          label: 'Icon',
          options: [
            { label: 'Database', value: 'Database' },
            { label: 'Layout Template', value: 'LayoutTemplate' },
            { label: 'Terminal', value: 'Terminal' },
          ],
          defaultValue: 'Database',
        }),
        image: fields.image({
          label: 'Project Image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
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
        icon: fields.select({
          label: 'Icon',
          options: [
            { label: 'Layout (Backend)', value: 'Layout' },
            { label: 'Cloud', value: 'Cloud' },
            { label: 'Shield (CI/CD)', value: 'Shield' },
            { label: 'Database', value: 'Database' },
            { label: 'Zap (Frontend)', value: 'Zap' },
          ],
          defaultValue: 'Layout',
        }),
        colorTheme: fields.select({
          label: 'Color Theme',
          options: [
            { label: 'Primary (Blue)', value: 'primary' },
            { label: 'Secondary (Purple)', value: 'secondary' },
            { label: 'Green', value: 'green' },
            { label: 'Orange', value: 'orange' },
            { label: 'Accent (White)', value: 'accent' },
          ],
          defaultValue: 'primary',
        }),
        fullWidth: fields.checkbox({ label: 'Full Width (md:col-span-2)', defaultValue: false }),
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
    about: singleton({
      label: 'About Section',
      path: 'content/about',
      format: { data: 'yaml' },
      schema: {
        en: fields.object(
          {
            badge: fields.text({ label: 'Badge Text' }),
            title: fields.text({ label: 'Section Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
            currentLabel: fields.text({ label: 'Current Card Label' }),
            currentTitle: fields.text({ label: 'Current Role Title' }),
            currentCompany: fields.text({ label: 'Current Company' }),
            currentDescription: fields.text({ label: 'Current Description', multiline: true }),
            techTitle: fields.text({ label: 'Tech Stack Title' }),
            yearsLabel: fields.text({ label: 'Years Label' }),
            expertiseBadge: fields.text({ label: 'Expertise Badge' }),
            expertiseHeading: fields.text({ label: 'Expertise Heading' }),
            expertiseLead: fields.text({ label: 'Expertise Lead', multiline: true }),
            expertiseNote: fields.text({ label: 'Expertise Note', multiline: true }),
          },
          { label: 'English Content' }
        ),
        id: fields.object(
          {
            badge: fields.text({ label: 'Badge Text' }),
            title: fields.text({ label: 'Section Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
            currentLabel: fields.text({ label: 'Current Card Label' }),
            currentTitle: fields.text({ label: 'Current Role Title' }),
            currentCompany: fields.text({ label: 'Current Company' }),
            currentDescription: fields.text({ label: 'Current Description', multiline: true }),
            techTitle: fields.text({ label: 'Tech Stack Title' }),
            yearsLabel: fields.text({ label: 'Years Label' }),
            expertiseBadge: fields.text({ label: 'Expertise Badge' }),
            expertiseHeading: fields.text({ label: 'Expertise Heading' }),
            expertiseLead: fields.text({ label: 'Expertise Lead', multiline: true }),
            expertiseNote: fields.text({ label: 'Expertise Note', multiline: true }),
          },
          { label: 'Indonesian Content' }
        ),
        interests: fields.array(
          fields.object({
            icon: fields.select({
              label: 'Icon',
              options: [
                { label: 'Globe', value: 'Globe' },
                { label: 'Line Chart', value: 'LineChart' },
                { label: 'Trophy', value: 'Trophy' },
              ],
              defaultValue: 'Globe',
            }),
            colorTheme: fields.select({
              label: 'Color Theme',
              options: [
                { label: 'Primary (Blue)', value: 'primary' },
                { label: 'Secondary (Purple)', value: 'secondary' },
                { label: 'Green', value: 'green' },
              ],
              defaultValue: 'primary',
            }),
            en: fields.object(
              { label: fields.text({ label: 'Label' }) },
              { label: 'English Content' }
            ),
            id: fields.object(
              { label: fields.text({ label: 'Label' }) },
              { label: 'Indonesian Content' }
            ),
          }),
          { label: 'Interest Items', itemLabel: (props) => props.fields.icon.value }
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
        availability: fields.checkbox({ label: 'Available for Work', defaultValue: true }),
        techStack: fields.array(
          fields.text({ label: 'Technology' }),
          { label: 'Tech Stack', itemLabel: (props) => props.value }
        ),
        github: fields.text({ label: 'GitHub URL' }),
        linkedin: fields.text({ label: 'LinkedIn URL' }),
        email: fields.text({ label: 'Email Address' }),
      },
    }),

    hero: singleton({
      label: 'Hero Section',
      path: 'content/hero',
      format: { data: 'yaml' },
      schema: {
        stats: fields.array(
          fields.object({
            emoji: fields.text({ label: 'Emoji' }),
            label: fields.text({ label: 'Label' }),
          }),
          { label: 'Stats Badges', itemLabel: (props) => props.fields.label.value }
        ),
        en: fields.object(
          {
            badge: fields.text({ label: 'Badge Text' }),
            title1: fields.text({ label: 'Title Line 1' }),
            title2: fields.text({ label: 'Title Line 2' }),
            subtitle: fields.text({ label: 'Subtitle' }),
            ctaContact: fields.text({ label: 'CTA: Contact' }),
            ctaProjects: fields.text({ label: 'CTA: Projects' }),
            codeRole: fields.text({ label: 'Code Block — role' }),
            codeSkill1: fields.text({ label: 'Code Block — skillUtama[0]' }),
            codeSkill2: fields.text({ label: 'Code Block — skillUtama[1]' }),
            codeImpact: fields.text({ label: 'Code Block — impact' }),
            codeDelivery: fields.text({ label: 'Code Block — delivery' }),
          },
          { label: 'English Content' }
        ),
        id: fields.object(
          {
            badge: fields.text({ label: 'Badge Text' }),
            title1: fields.text({ label: 'Title Line 1' }),
            title2: fields.text({ label: 'Title Line 2' }),
            subtitle: fields.text({ label: 'Subtitle' }),
            ctaContact: fields.text({ label: 'CTA: Contact' }),
            ctaProjects: fields.text({ label: 'CTA: Projects' }),
            codeRole: fields.text({ label: 'Code Block — role' }),
            codeSkill1: fields.text({ label: 'Code Block — skillUtama[0]' }),
            codeSkill2: fields.text({ label: 'Code Block — skillUtama[1]' }),
            codeImpact: fields.text({ label: 'Code Block — impact' }),
            codeDelivery: fields.text({ label: 'Code Block — delivery' }),
          },
          { label: 'Indonesian Content' }
        ),
      },
    }),
  },
})
