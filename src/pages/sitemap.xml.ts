import type { APIRoute } from 'astro'
import { SITE_URL } from '@/lib/config'
import { getProjects } from '@/lib/projects'

export const prerender = true

export const GET: APIRoute = async () => {
  const projects = await getProjects()
  const paths = ['/', ...projects.map((p) => `/projects/${p.slug}`)]
  const urls = paths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
