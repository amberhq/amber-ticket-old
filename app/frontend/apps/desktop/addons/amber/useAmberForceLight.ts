// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { useMutationObserver } from '@vueuse/core'
import { watch } from 'vue'

import { useSessionStore } from '#shared/stores/session.ts'

// The design is light-only (AI-1329 FR-7, LLD §5.3).
//   Signed in: the stored theme preference is overridden in memory only (no mutation is sent),
//   so Zammad's theme store renders light and a rollback restores the user's choice.
//   Signed out: the theme store follows the OS; the observer resets `data-theme` to light.
export const useAmberForceLight = () => {
  const session = useSessionStore()

  watch(
    () => [session.user?.id, session.user?.preferences?.theme],
    () => {
      if (session.user && session.user.preferences?.theme !== 'light')
        session.setUserPreference('theme', 'light')
    },
    { immediate: true },
  )

  const root = document.documentElement

  const forceLight = () => {
    if (root.dataset.theme === 'light') return

    root.dataset.theme = 'light'
    root.style.colorScheme = 'light'
  }

  forceLight()
  useMutationObserver(root, forceLight, { attributes: true, attributeFilter: ['data-theme'] })
}
