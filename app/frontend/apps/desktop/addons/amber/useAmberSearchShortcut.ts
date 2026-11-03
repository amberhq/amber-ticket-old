// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { onKeyStroke } from '@vueuse/core'
import { useRouter } from 'vue-router'

// An open dialog, or an open flyout (Zammad's side panels, e.g. Merge), keeps ⌘K to itself.
const OVERLAY = '[role="dialog"], aside[id^="flyout-"]:not(.hidden)'

// ⌘K / Ctrl+K opens the search page, except while a dialog or flyout is open (AI-1329 FR-12).
export const isAmberSearchShortcut = (event: KeyboardEvent): boolean => {
  if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return false

  return !document.activeElement?.closest(OVERLAY) && !document.querySelector(OVERLAY)
}

export const useAmberSearchShortcut = () => {
  const router = useRouter()

  onKeyStroke(
    (event) => isAmberSearchShortcut(event) && router.hasRoute('Search'),
    (event) => {
      event.preventDefault()
      router.push({ name: 'Search' })
    },
  )
}
