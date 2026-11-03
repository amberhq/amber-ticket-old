// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { getActivePinia } from 'pinia'
import { computed } from 'vue'

import { useTicketOverviewsStore } from '#desktop/entities/ticket/stores/ticketOverviews.ts'

// Count behind the sidebar's "N to assign" pill: Zammad's `all_unassigned` overview (AI-1329 FR-13).
// Returns null when the overview is missing.
export const amberUnassignedCount = (
  overviewsByLink: Record<string, { id: ID } | undefined> | undefined,
  countById: Record<ID, number | undefined> | undefined,
): number | null => {
  const overview = overviewsByLink?.all_unassigned
  if (!overview) return null

  return countById?.[overview.id] ?? null
}

// Reads the counts Zammad already polls for every overview; adds no request. The store is never
// started here: AppDesktop starts it once the session is ready (and drops it on logout), so the
// pill only reads it once it exists.
export const useAmberUnassignedCount = () => {
  const pinia = getActivePinia()

  return computed(() => {
    if (!pinia?.state.value.ticketOverviews) return null

    const store = useTicketOverviewsStore(pinia)

    return amberUnassignedCount(store.overviewsByLink, store.overviewsTicketCountById)
  })
}
