// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

// Allow-list for the AI-1329 colour check (FR-18): every colour defined in the skin's 10-tokens.css,
// as lower-case hex. Scaffold: behaviour comes with the AI-1329 implementation.
export const buildAllowList = (_tokensCss) => new Set()
