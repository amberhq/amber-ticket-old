// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

// Allow-list for the AI-1329 colour check (FR-18): every colour written in the skin's
// 10-tokens.css. Hex colours become 6-digit lower-case hex; rgba() colours keep their alpha.

const expandHex = (hex) => {
  const value = hex.slice(1).toLowerCase()

  return `#${value.length === 3 ? [...value].map((c) => c + c).join('') : value}`
}

export const normaliseRgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${Number(a)})`

export const buildAllowList = (tokensCss) => {
  const css = tokensCss.replace(/\/\*[\s\S]*?\*\//g, '')
  const allowed = new Set()

  for (const [hex] of css.matchAll(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi)) allowed.add(expandHex(hex))

  for (const [, r, g, b, a] of css.matchAll(
    /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/gi,
  ))
    allowed.add(normaliseRgba(r, g, b, a))

  return allowed
}
