import { test } from 'node:test'
import assert from 'node:assert/strict'
import { githubUsername, linkOrEmpty, initials, whatsappUrl } from '../src/lib/identity.ts'

test('githubUsername extracts the user from profile URLs', () => {
  assert.equal(githubUsername('https://github.com/mchdfrhn'), 'mchdfrhn')
  assert.equal(githubUsername('https://github.com/mchdfrhn/'), 'mchdfrhn')
  assert.equal(githubUsername('https://github.com/mchdfrhn.git'), 'mchdfrhn')
})

test('githubUsername returns empty string for non-GitHub or empty input', () => {
  assert.equal(githubUsername('https://gitlab.com/x'), '')
  assert.equal(githubUsername(''), '')
})

test('initials abbreviates all but the last name', () => {
  assert.equal(initials('Mochamad Farhan Ali'), 'M. F. Ali')
  assert.equal(initials('Farhan Ali'), 'F. Ali')
  assert.equal(initials('Farhan'), 'Farhan')
  assert.equal(initials(''), '')
})

test('whatsappUrl normalises international and local phone formats', () => {
  assert.equal(whatsappUrl('+62 857-7182-6637'), 'https://wa.me/6285771826637')
  assert.equal(whatsappUrl('0857-7182-6637'), 'https://wa.me/6285771826637')
  assert.equal(whatsappUrl(''), '')
})

test('linkOrEmpty drops placeholder and blank links', () => {
  assert.equal(linkOrEmpty('#'), '')
  assert.equal(linkOrEmpty('  '), '')
  assert.equal(linkOrEmpty(''), '')
  assert.equal(linkOrEmpty('https://sipekad-sttpu.surupan.tech/'), 'https://sipekad-sttpu.surupan.tech/')
})
