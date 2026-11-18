import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tagCounts, resolveTag } from '../src/lib/tags.ts'

test('tagCounts counts only used tags, in PROJECT_TAGS order', () => {
  const result = tagCounts([
    { tags: ['website'] },
    { tags: ['landing-page', 'client'] },
    { tags: ['client'] },
    { tags: [] },
  ])
  assert.deepEqual(result, [
    { tag: 'website', count: 1 },
    { tag: 'landing-page', count: 1 },
    { tag: 'client', count: 2 },
  ])
})

test('tagCounts ignores unknown tag strings', () => {
  assert.deepEqual(tagCounts([{ tags: ['bogus'] }]), [])
})

test('resolveTag returns the param only when it is available', () => {
  assert.equal(resolveTag('client', ['client', 'website']), 'client')
})

test('resolveTag falls back to null for unknown, empty or missing params', () => {
  assert.equal(resolveTag('nope', ['client']), null)
  assert.equal(resolveTag(null, ['client']), null)
  assert.equal(resolveTag(undefined, ['client']), null)
  assert.equal(resolveTag('', ['client']), null)
})
