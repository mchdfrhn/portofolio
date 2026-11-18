import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Content waiting to animate in must stay in the accessibility tree:
// hide it with opacity only. visibility:hidden (and GSAP's autoAlpha, which
// sets it) removes headings and links from screen readers until scrolled to.
const sources = ['src/scripts/motion.ts', 'src/pages/projects/index.astro']

test('motion never hides content with autoAlpha', () => {
  for (const file of sources) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /autoAlpha/, file)
  }
})

test('motion-pending CSS hides with opacity, not visibility', () => {
  const css = readFileSync('src/styles/globals.css', 'utf8')
  const block = css.slice(css.indexOf('html.motion-pending'), css.indexOf('}', css.indexOf('html.motion-pending')))
  assert.match(block, /opacity:\s*0/)
  assert.doesNotMatch(block, /visibility\s*:/)
})
