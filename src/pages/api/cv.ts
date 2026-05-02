import type { APIRoute } from 'astro'
import PDFDocument from 'pdfkit'
import { getCvData } from '@/lib/cv-data'
import type { CvData, Lang } from '@/lib/cv-data'

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const rawLang = url.searchParams.get('lang') ?? 'en'
  const lang: Lang = rawLang === 'id' ? 'id' : 'en'

  const data = await getCvData(lang)
  const pdfBuffer = await buildPdf(data, lang)

  const filename = `cv-${data.name.toLowerCase().replace(/\s+/g, '-')}.pdf`

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache',
    },
  })
}

function buildPdf(data: CvData, lang: Lang): Promise<Buffer> {
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

    // ── HEADER ──────────────────────────────────────────────────────
    doc.fontSize(20).font('Helvetica-Bold').fillColor(C.black).text(data.name)
    doc.fontSize(11).font('Helvetica').fillColor(C.accent).text(data.jobTitle)
    doc.moveDown(0.3)

    const contactLine = [
      data.location,
      data.email,
      data.github.replace('https://', ''),
      data.linkedin.replace('https://', ''),
    ].filter(Boolean).join('  |  ')

    doc.fontSize(9).fillColor(C.gray).text(contactLine)
    doc.moveDown(0.6)

    doc.moveTo(X, doc.y).lineTo(X + CONTENT_WIDTH, doc.y)
      .strokeColor(C.divider).lineWidth(0.5).stroke()
    doc.moveDown(0.6)

    // ── HELPERS ─────────────────────────────────────────────────────
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

    // ── WORK EXPERIENCE ─────────────────────────────────────────────
    section(lang === 'en' ? 'Work Experience' : 'Pengalaman Kerja')

    for (const job of data.workExperience) {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(C.dark).text(job.title)
      doc.fontSize(9).font('Helvetica').fillColor(C.light)
        .text(`${job.company}  •  ${job.period}`)
      doc.moveDown(0.25)
      descBullets(job.description)
      doc.moveDown(0.6)
    }

    // ── EDUCATION ───────────────────────────────────────────────────
    section(lang === 'en' ? 'Education' : 'Pendidikan')

    for (const edu of data.education) {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(C.dark).text(edu.title)
      doc.fontSize(9).font('Helvetica').fillColor(C.light)
        .text(`${edu.company}  •  ${edu.period}`)
      doc.moveDown(0.25)
      descBullets(edu.description)
      doc.moveDown(0.6)
    }

    // ── TECHNICAL SKILLS ────────────────────────────────────────────
    section(lang === 'en' ? 'Technical Skills' : 'Keahlian Teknis')

    for (const exp of data.expertise) {
      doc.fontSize(9).font('Helvetica-Bold').fillColor(C.dark)
        .text(`${exp.name}: `, { continued: true })
      doc.font('Helvetica').fillColor(C.gray).text(exp.tech.join(', '))
    }

    doc.moveDown(0.6)

    // ── PROJECTS ────────────────────────────────────────────────────
    section(lang === 'en' ? 'Projects' : 'Proyek')

    for (const proj of data.projects) {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(C.dark).text(proj.title)
      doc.fontSize(9).font('Helvetica').fillColor(C.gray)
        .text(`Tech: ${proj.tech.join(', ')}`)
      doc.moveDown(0.2)
      if (proj.problem) bullet(`Problem: ${proj.problem}`)
      if (proj.impact) bullet(`Impact: ${proj.impact}`)
      if (proj.github) {
        doc.fontSize(9).font('Helvetica').fillColor(C.accent)
          .text(proj.github.replace('https://', ''), { indent: 8 })
      }
      doc.moveDown(0.5)
    }

    doc.end()
  })
}
