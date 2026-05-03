import type { APIRoute } from 'astro'
import { getCvData } from '@/lib/cv-data'
import { buildCvPdf } from '@/lib/cv-pdf'
import type { Lang } from '@/lib/cv-data'

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const rawLang = url.searchParams.get('lang') ?? 'en'
  const lang: Lang = rawLang === 'id' ? 'id' : 'en'

  const data = await getCvData(lang)
  const pdfBuffer = await buildCvPdf(data, lang)

  const filename = `cv-${data.name.toLowerCase().replace(/\s+/g, '-')}.pdf`

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache',
    },
  })
}
