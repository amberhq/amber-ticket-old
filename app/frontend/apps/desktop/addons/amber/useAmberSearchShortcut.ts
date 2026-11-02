// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { onKeyStroke } from '@vueuse/core'
import { useRouter } from 'vue-router'

// ⌘K / Ctrl+K opens the search page, except while a dialog has focus (AI-1329 FR-12).
export const isAmberSearchShortcut = (event: KeyboardEvent): boolean => {
  if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return false

  return !document.activeElement?.closest('[role="dialog"]')
}

export const useAmberSearchShortcut = () => {
  const router = useRouter()

  onKeyStroke(
    (event) => isAmberSearchShortcut(event),
    (event) => {
      event.preventDefault()
      router.push({ name: 'Search' })
    },
  )
}
