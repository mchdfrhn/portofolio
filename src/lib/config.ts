// Deploy-level configuration only. Everything about the person (name, links, contact) lives in
// the Keystatic "Profile" singleton.
export const SITE_URL = (import.meta.env.PUBLIC_SITE_URL ?? "https://www.mochamadfarhanali.my.id").replace(/\/$/, "");
// Link previews (WhatsApp, LinkedIn) need an absolute og:image URL
const ogImage = import.meta.env.PUBLIC_OG_IMAGE ?? "/og-image.png";
export const OG_IMAGE = ogImage.startsWith("/") ? `${SITE_URL}${ogImage}` : ogImage;
