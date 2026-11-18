// Small pure helpers that derive display values from the profile singleton.

export function githubUsername(url: string): string {
  const match = url.trim().match(/^https?:\/\/(?:www\.)?github\.com\/([^/?#\s]+?)(?:\.git)?\/?$/i)
  return match ? match[1] : ''
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return parts[0] ?? ''
  const last = parts[parts.length - 1]
  return [...parts.slice(0, -1).map((p) => `${p[0].toUpperCase()}.`), last].join(' ')
}

export function whatsappUrl(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`
  return `https://wa.me/${digits}`
}

/** Treat blank or placeholder ('#') links as absent. */
export function linkOrEmpty(url: string | null | undefined): string {
  const u = (url ?? '').trim()
  return u === '#' ? '' : u
}
