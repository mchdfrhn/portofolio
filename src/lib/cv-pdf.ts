import PDFDocument from 'pdfkit'
import type { CvData, Lang } from './cv-data'

// ATS notes: single column, standard section names, real text (no images/tables),
// standard fonts, and every link written out as plain text.
export function buildCvPdf(data: CvData, lang: Lang): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 48, bottom: 48, left: 56, right: 56 },
      info: {
        Title: `${data.name} - ${data.jobTitle} - CV`,
        Author: data.name,
        Subject: data.jobTitle,
        Keywords: data.skillGroups.flatMap((g) => g.items).join(', '),
      },
    })

    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const CONTENT_WIDTH = doc.page.width - doc.page.margins.left - doc.page.margins.right
    const X = doc.page.margins.left
    const en = lang === 'en'

    const C = {
      ink: '#111111',
      body: '#2b2b2b',
      meta: '#555555',
      rule: '#999999',
    }

    const stripProtocol = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

    // ── Header ──
    doc.font('Helvetica-Bold').fontSize(20).fillColor(C.ink).text(data.name)
    doc.font('Helvetica').fontSize(11).fillColor(C.body).text(data.jobTitle)
    doc.moveDown(0.3)

    // Short lines so no URL gets wrapped mid-way
    const contactLines = [
      [data.location, data.phone, data.email],
      [data.linkedin, data.github, data.softwareHouseUrl].filter(Boolean).map(stripProtocol),
    ]
    doc.fontSize(9).fillColor(C.meta)
    for (const line of contactLines) {
      const text = line.filter(Boolean).join('  |  ')
      if (text) doc.text(text)
    }
    doc.moveDown(0.8)

    // ── Helpers ──
    const section = (title: string) => {
      keepWithNext(90)
      doc.moveDown(0.2)
      doc.font('Helvetica-Bold').fontSize(10.5).fillColor(C.ink).text(title.toUpperCase(), { characterSpacing: 0.6 })
      const y = doc.y + 1
      doc.moveTo(X, y).lineTo(X + CONTENT_WIDTH, y).strokeColor(C.rule).lineWidth(0.6).stroke()
      doc.moveDown(0.45)
    }

    // Hanging indent: wrapped lines align with the text, not the bullet
    const bullet = (text: string) => {
      doc.font('Helvetica').fontSize(9.5).fillColor(C.body)
      const y = doc.y
      doc.text('•', X + 6, y, { lineBreak: false })
      doc.text(text, X + 16, y, { width: CONTENT_WIDTH - 16, lineGap: 1.2 })
      doc.x = X
    }

    // Start a new page instead of leaving a heading stranded at the bottom
    const keepWithNext = (space = 70) => {
      if (doc.y + space > doc.page.height - doc.page.margins.bottom) doc.addPage()
    }

    const sentences = (text: string) =>
      text.split(/(?<=\.)\s+/).map((s) => s.trim()).filter(Boolean)

    const labelLine = (label: string, value: string) => {
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C.ink).text(`${label}: `, { continued: true })
      doc.font('Helvetica').fillColor(C.body).text(value, { lineGap: 1.2 })
    }

    const entryHeading = (title: string, org: string, period: string) => {
      keepWithNext()
      // Kept in reading order (title, then org | period) so parsers attach dates to the right job
      doc.font('Helvetica-Bold').fontSize(10).fillColor(C.ink).text(title)
      doc.font('Helvetica').fontSize(9.5).fillColor(C.meta).text([org, period].filter(Boolean).join('  |  '))
      doc.moveDown(0.2)
    }

    // ── Summary ──
    if (data.summary) {
      section(en ? 'Summary' : 'Ringkasan')
      doc.font('Helvetica').fontSize(9.5).fillColor(C.body).text(data.summary, { lineGap: 1.2 })
      doc.moveDown(0.6)
    }

    // ── Skills ──
    section(en ? 'Skills' : 'Keahlian')
    if (data.coreCompetencies.length) {
      labelLine(en ? 'Core Competencies' : 'Kompetensi Inti', data.coreCompetencies.join(', '))
    }
    for (const group of data.skillGroups) {
      labelLine(group.label, group.items.join(', '))
    }
    doc.moveDown(0.6)

    // ── Work Experience ──
    section(en ? 'Work Experience' : 'Pengalaman Kerja')
    for (const job of data.workExperience) {
      entryHeading(job.title, job.company, job.period)
      sentences(job.description).forEach(bullet)
      doc.moveDown(0.55)
    }

    // ── Projects ──
    if (data.projects.length) {
      section(en ? 'Projects' : 'Proyek')
      for (const proj of data.projects) {
        keepWithNext()
        doc.font('Helvetica-Bold').fontSize(10).fillColor(C.ink)
          .text(proj.title, { continued: !!proj.tagline })
        if (proj.tagline) doc.font('Helvetica').fillColor(C.meta).text(` - ${proj.tagline}`)
        doc.font('Helvetica').fontSize(9.5).fillColor(C.meta).text(proj.tech.join(', '))
        doc.moveDown(0.15)
        // Work Experience already tells the story; one bullet keeps this section from repeating it
        if (proj.solution) bullet(proj.solution)
        const links = [proj.demo, proj.github].filter(Boolean).map((l) => stripProtocol(l!))
        if (links.length) {
          doc.font('Helvetica').fontSize(9).fillColor(C.meta).text(links.join('  |  '), X + 8)
          doc.x = X
        }
        doc.moveDown(0.55)
      }
    }

    // ── Education ──
    section(en ? 'Education & Training' : 'Pendidikan & Pelatihan')
    for (const edu of data.education) {
      entryHeading(edu.title, edu.company, edu.period)
      sentences(edu.description).forEach(bullet)
      doc.moveDown(0.4)
    }

    doc.end()
  })
}
