// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useTicketOverviewsStore } from '#desktop/entities/ticket/stores/ticketOverviews.ts'

// Count behind the sidebar's "N to assign" pill: Zammad's `all_unassigned` overview (AI-1329 FR-13).
// Returns null when the overview is missing.
export const amberUnassignedCount = (
  overviewsByLink: Record<string, { id: ID } | undefined>,
  countById: Record<ID, number | undefined>,
): number | null => {
  const overview = overviewsByLink.all_unassigned
  if (!overview) return null

  return countById[overview.id] ?? null
}

// Reads the counts Zammad already polls for every overview; adds no request.
export const useAmberUnassignedCount = () => {
  const { overviewsByLink, overviewsTicketCountById } = storeToRefs(useTicketOverviewsStore())

  return computed(() => amberUnassignedCount(overviewsByLink.value, overviewsTicketCountById.value))
}
