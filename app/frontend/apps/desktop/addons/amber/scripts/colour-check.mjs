#!/usr/bin/env node
// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

// AI-1329 FR-18 colour check: signs in, visits the 5 named desktop pages and fails if any rendered
// colour is outside the Amber palette (every colour written in styles/custom/amber/10-tokens.css).
// Uploaded images, ticket/article content and email HTML are excluded.
//
//   AMBER_QA_PASSWORD=… node app/frontend/apps/desktop/addons/amber/scripts/colour-check.mjs \
//     --base http://localhost:3000 --user amber.agent@example.com [--ticket 19] [--search amber]

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

import { chromium } from 'playwright'

import { buildAllowList } from './colourAllowList.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const allowed = buildAllowList(
  readFileSync(resolve(here, '../../../styles/custom/amber/10-tokens.css'), 'utf8'),
)

const { values: args } = parseArgs({
  options: {
    base: { type: 'string', default: 'http://localhost:3000' },
    user: { type: 'string', default: 'amber.agent@example.com' },
    ticket: { type: 'string' },
    search: { type: 'string', default: 'amber' },
  },
})

const password = process.env.AMBER_QA_PASSWORD
if (!password) {
  console.error('Set AMBER_QA_PASSWORD to the QA user password.')
  process.exit(2)
}

const EXCLUDED = [
  'img',
  'svg image',
  'iframe',
  '[data-test-id="article-content"]',
  '[data-zammad-target="ArticleBubbleBody"]',
  '.ProseMirror',
].join(', ')

// Collected in the page: every visible element's colour properties, as rgb()/rgba() strings.
const collect = (excluded) => {
  const props = [
    'color',
    'background-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'outline-color',
  ]
  const found = []

  // Let the browser normalise any colour syntax (oklab, color-mix, named) to #rrggbb or rgba().
  const ctx = document.createElement('canvas').getContext('2d')
  const normalise = (value) => {
    ctx.fillStyle = '#010203'
    ctx.fillStyle = value

    return ctx.fillStyle
  }

  for (const el of document.querySelectorAll('body *')) {
    if (el.closest(excluded)) continue
    const box = el.getBoundingClientRect()
    if (!box.width || !box.height) continue

    const style = getComputedStyle(el)
    if (style.visibility === 'hidden' || style.display === 'none') continue

    for (const prop of props) {
      if (prop.startsWith('border') && style[prop.replace('-color', '-width')] === '0px') continue
      if (prop === 'outline-color' && style.outlineStyle === 'none') continue

      found.push({
        prop,
        value: normalise(style.getPropertyValue(prop)),
        path: `${el.tagName.toLowerCase()}${el.dataset.zammadTarget ? `[${el.dataset.zammadTarget}]` : ''}${el.className && typeof el.className === 'string' ? `.${el.className.split(' ').slice(0, 2).join('.')}` : ''}`,
      })
    }
  }

  return found
}

const toToken = (value) => {
  if (value.startsWith('#')) return value.toLowerCase()

  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!match) return value

  const [, r, g, b, a] = match
  if (a !== undefined && Number(a) === 0) return 'transparent'
  // Two decimals, as the palette writes them (the canvas reports e.g. 0.8 as 0.8 or 0.796).
  if (a !== undefined && Number(a) < 1)
    return `rgba(${r}, ${g}, ${b}, ${Math.round(Number(a) * 100) / 100})`

  return `#${[r, g, b].map((n) => Number(n).toString(16).padStart(2, '0')).join('')}`
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const base = args.base.replace(/\/$/, '')
const failures = []

const check = async (label, url) => {
  await page.goto(`${base}${url}`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1500)

  const bad = new Map()
  for (const { prop, value, path } of await page.evaluate(collect, EXCLUDED)) {
    const token = toToken(value)
    if (token === 'transparent' || allowed.has(token)) continue
    if (!bad.has(token)) bad.set(token, `${prop} on ${path}`)
  }

  console.log(`${bad.size ? 'FAIL' : 'ok  '} ${label} (${url}) — ${bad.size} colour(s) outside the palette`)
  for (const [token, where] of bad) console.log(`       ${token}  ${where}`)
  if (bad.size) failures.push(label)
}

await check('Login', '/desktop/login')

await page.getByLabel('Username / Email').fill(args.user)
await page.getByLabel('Password').fill(password)
await page.getByRole('button', { name: 'Sign in' }).click()
await page.waitForURL((url) => !url.pathname.endsWith('/login'))

await check('Ticket list', '/desktop/tickets/view/all_unassigned')
if (args.ticket) await check('Ticket detail', `/desktop/tickets/${args.ticket}`)
else console.log('skip Ticket detail — pass --ticket <id>')
await check('Search', `/desktop/search/${encodeURIComponent(args.search)}`)
await check('Personal settings', '/desktop/personal-setting/locale')

await browser.close()
process.exit(failures.length ? 1 : 0)
