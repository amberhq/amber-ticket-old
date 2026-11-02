// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

// ⌘K / Ctrl+K opens the search page, except while a dialog has focus (AI-1329 FR-12).
// Scaffold: behaviour comes with the AI-1329 implementation.
export const isAmberSearchShortcut = (_event: KeyboardEvent): boolean => false
