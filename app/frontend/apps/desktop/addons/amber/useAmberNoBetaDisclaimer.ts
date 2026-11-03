// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { useLocalStorage } from '@vueuse/core'

// The desktop view is the default, not a beta (AI-1329 FR-17): mark Zammad's one-time
// "New desktop BETA UI" disclaimer as dismissed. useLocalStorage syncs refs with the same key, so
// Zammad's own `useBetaUiDisclaimer` sees the flag before it would open the dialog.
export const useAmberNoBetaDisclaimer = () => {
  useLocalStorage('beta-ui-disclaimer', true).value = true
}
