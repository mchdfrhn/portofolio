export const SITE_TITLE = import.meta.env.PUBLIC_SITE_TITLE ?? "Mochammad Farhan Ali";
export const SITE_DESCRIPTION =
  import.meta.env.PUBLIC_SITE_DESCRIPTION ??
  "Fullstack Developer (TypeScript, Next.js, Golang) based in Jakarta — building web apps, REST APIs, and cloud deployments.";
export const SITE_URL = (import.meta.env.PUBLIC_SITE_URL ?? "https://www.mochamadfarhanali.my.id").replace(/\/$/, "");
// Link previews (WhatsApp, LinkedIn) need an absolute og:image URL
const ogImage = import.meta.env.PUBLIC_OG_IMAGE ?? "/og-image.png";
export const OG_IMAGE = ogImage.startsWith("/") ? `${SITE_URL}${ogImage}` : ogImage;
export const GITHUB_URL =
  import.meta.env.PUBLIC_GITHUB_URL ?? "https://github.com/mchdfrhn";
export const LINKEDIN_URL =
  import.meta.env.PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/in/mchdfrhn";
export const EMAIL =
  import.meta.env.PUBLIC_EMAIL ?? "mochamadfarhanali@gmail.com";
export const WHATSAPP_URL =
  import.meta.env.PUBLIC_WHATSAPP_URL ?? "https://wa.me/6285771826637";
