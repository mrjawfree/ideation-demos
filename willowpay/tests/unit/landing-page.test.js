import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'

const currentDir = dirname(fileURLToPath(import.meta.url))
const indexHtmlPath = resolve(currentDir, '../../index.html')
const indexHtml = readFileSync(indexHtmlPath, 'utf8')

describe('landing page structure', () => {
  test('includes expected title and waitlist form hooks', () => {
    expect(indexHtml).toContain('<title>WillowPay')
    expect(indexHtml).toContain('id="waitlist-form"')
    expect(indexHtml).toContain('id="email-input"')
    expect(indexHtml).toContain('id="waitlist-success"')
  })
})
