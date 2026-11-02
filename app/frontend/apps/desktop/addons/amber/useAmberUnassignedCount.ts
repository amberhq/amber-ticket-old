// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import type { ID } from '#shared/types/utils.ts'

// Count behind the sidebar's "N to assign" pill: Zammad's `all_unassigned` overview (AI-1329 FR-13).
// Returns null when the overview is missing. Scaffold: behaviour comes with the AI-1329 implementation.
export const amberUnassignedCount = (
  _overviewsByLink: Record<string, { id: ID } | undefined>,
  _countById: Record<ID, number | undefined>,
): number | null => null
