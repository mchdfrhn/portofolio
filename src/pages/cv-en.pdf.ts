import type { APIRoute } from 'astro'
import { getCvData } from '@/lib/cv-data'
import { buildCvPdf } from '@/lib/cv-pdf'

export const prerender = true

export const GET: APIRoute = async () => {
  const data = await getCvData('en')
  const pdfBuffer = await buildCvPdf(data, 'en')

  // Copy into a plain Uint8Array: Response does not type-accept a Node Buffer
  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="cv-mochamad-farhan-ali-en.pdf"',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
