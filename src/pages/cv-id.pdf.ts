import type { APIRoute } from 'astro'
import { getCvData } from '@/lib/cv-data'
import { buildCvPdf } from '@/lib/cv-pdf'

export const prerender = true

export const GET: APIRoute = async () => {
  const data = await getCvData('id')
  const pdfBuffer = await buildCvPdf(data, 'id')

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="cv-mochamad-farhan-ali-id.pdf"',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
