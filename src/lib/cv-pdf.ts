import PDFDocument from 'pdfkit'
import type { CvData, Lang } from './cv-data'

export function buildCvPdf(data: CvData, lang: Lang): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
      info: { Title: `CV - ${data.name}`, Author: data.name },
    })

    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const CONTENT_WIDTH = doc.page.width - doc.page.margins.left - doc.page.margins.right
    const X = doc.page.margins.left

    const C = {
      black: '#111111',
      dark: '#333333',
      gray: '#555555',
      light: '#888888',
      accent: '#0070f3',
      divider: '#cccccc',
    }

    doc.fontSize(20).font('Helvetica-Bold').fillColor(C.black).text(data.name)
    doc.fontSize(11).font('Helvetica').fillColor(C.accent).text(data.jobTitle)
    doc.moveDown(0.3)

    const contactLine = [
      data.location,
      data.email,
      data.github.replace('https://', ''),
      data.linkedin.replace('https://', ''),
      data.softwareHouseUrl ? data.softwareHouseUrl.replace('https://', '') : '',
    ].filter(Boolean).join('  |  ')

    doc.fontSize(9).fillColor(C.gray).text(contactLine)
    doc.moveDown(0.6)

    doc.moveTo(X, doc.y).lineTo(X + CONTENT_WIDTH, doc.y)
      .strokeColor(C.divider).lineWidth(0.5).stroke()
    doc.moveDown(0.6)

    const section = (title: string) => {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(C.black)
        .text(title.toUpperCase(), { characterSpacing: 0.8 })
      doc.moveDown(0.15)
      doc.moveTo(X, doc.y).lineTo(X + CONTENT_WIDTH, doc.y)
        .strokeColor(C.accent).lineWidth(1).stroke()
      doc.moveDown(0.4)
      doc.lineWidth(0.5)
    }

    const bullet = (text: string) => {
      doc.fontSize(9).font('Helvetica').fillColor(C.dark)
        .text(`•  ${text}`, { indent: 8, lineGap: 1 })
    }

    const descBullets = (description: string) => {
      const parts = description.split(/\.\s+/).filter(Boolean)
      for (const part of parts) {
        const s = part.trim()
        bullet(s.endsWith('.') ? s : `${s}.`)
      }
    }

    const compactBullet = (label: string, text: string) => {
      if (!text) return
      doc.fontSize(9).font('Helvetica-Bold').fillColor(C.dark)
        .text(`${label}: `, { continued: true, indent: 8 })
      doc.font('Helvetica').fillColor(C.dark).text(text)
    }

    if (data.summary) {
      section(lang === 'en' ? 'Profile' : 'Profil')
      doc.fontSize(9).font('Helvetica').fillColor(C.dark)
        .text(data.summary, { lineGap: 1 })
      if (data.softwareHouseName) {
        doc.moveDown(0.25)
        compactBullet(
          lang === 'en' ? 'Software House' : 'Software House',
          [data.softwareHouseName, data.softwareHouseUrl ? data.softwareHouseUrl.replace('https://', '') : '']
            .filter(Boolean)
            .join(' - '),
        )
      }
      doc.moveDown(0.6)
    }

    section(lang === 'en' ? 'Work Experience' : 'Pengalaman Kerja')

    for (const job of data.workExperience) {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(C.dark).text(job.title)
      doc.fontSize(9).font('Helvetica').fillColor(C.light)
        .text(`${job.company}  •  ${job.period}`)
      doc.moveDown(0.25)
      descBullets(job.description)
      doc.moveDown(0.6)
    }

    section(lang === 'en' ? 'Education' : 'Pendidikan')

    for (const edu of data.education) {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(C.dark).text(edu.title)
      doc.fontSize(9).font('Helvetica').fillColor(C.light)
        .text(`${edu.company}  •  ${edu.period}`)
      doc.moveDown(0.25)
      descBullets(edu.description)
      doc.moveDown(0.6)
    }

    section(lang === 'en' ? 'Technical Skills' : 'Keahlian Teknis')

    if (data.techStack.length) {
      doc.fontSize(9).font('Helvetica-Bold').fillColor(C.dark)
        .text(`${lang === 'en' ? 'Core Stack' : 'Stack Utama'}: `, { continued: true })
      doc.font('Helvetica').fillColor(C.gray).text(data.techStack.join(', '))
      doc.moveDown(0.25)
    }

    for (const exp of data.expertise) {
      doc.fontSize(9).font('Helvetica-Bold').fillColor(C.dark)
        .text(`${exp.name}: `, { continued: true })
      doc.font('Helvetica').fillColor(C.gray).text(exp.tech.join(', '))
      if (exp.description) {
        doc.fontSize(8).font('Helvetica').fillColor(C.gray)
          .text(exp.description, { indent: 8, lineGap: 1 })
      }
    }

    doc.moveDown(0.6)

    section(lang === 'en' ? 'Projects' : 'Proyek')

    for (const proj of data.projects) {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(C.dark).text(proj.title)
      if (proj.tagline) {
        doc.fontSize(9).font('Helvetica').fillColor(C.light).text(proj.tagline)
      }
      doc.fontSize(9).font('Helvetica').fillColor(C.gray)
        .text(`Tech: ${proj.tech.join(', ')}`)
      doc.moveDown(0.2)
      if (proj.problem) compactBullet(lang === 'en' ? 'Problem' : 'Masalah', proj.problem)
      if (proj.solution) compactBullet(lang === 'en' ? 'Solution' : 'Solusi', proj.solution)
      if (proj.impact) compactBullet(lang === 'en' ? 'Impact' : 'Dampak', proj.impact)
      const links = [proj.github, proj.demo]
        .filter(Boolean)
        .map((link) => link?.replace('https://', ''))
      if (links.length) {
        doc.fontSize(9).font('Helvetica').fillColor(C.accent)
          .text(links.join('  |  '), { indent: 8 })
      }
      doc.moveDown(0.5)
    }

    doc.end()
  })
}
