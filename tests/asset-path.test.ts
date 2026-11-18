import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toAssetKey } from '../src/lib/asset-path.ts'

test('toAssetKey keeps paths already under src/assets/projects', () => {
  assert.equal(toAssetKey('/src/assets/projects/sipekad/image.jpeg'), '/src/assets/projects/sipekad/image.jpeg')
})

test('toAssetKey maps the old public path to the asset folder', () => {
  assert.equal(toAssetKey('/images/projects/sipekad/gallery/0/image.jpeg'), '/src/assets/projects/sipekad/gallery/0/image.jpeg')
})

test('toAssetKey returns empty for empty input and leaves other URLs alone', () => {
  assert.equal(toAssetKey(''), '')
  assert.equal(toAssetKey(null), '')
  assert.equal(toAssetKey('https://example.com/a.png'), 'https://example.com/a.png')
})
