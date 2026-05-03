import { g as getCvData, b as buildCvPdf } from '../../chunks/cv-pdf_VvpBmx3L.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  const url = new URL(request.url);
  const rawLang = url.searchParams.get("lang") ?? "en";
  const lang = rawLang === "id" ? "id" : "en";
  const data = await getCvData(lang);
  const pdfBuffer = await buildCvPdf(data, lang);
  const filename = `cv-${data.name.toLowerCase().replace(/\s+/g, "-")}.pdf`;
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-cache"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
