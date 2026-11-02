// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

export interface AmberTeam {
  name: string
  initials: string
}

// The team shown in the sidebar header: the agent's first group by name (AI-1329 FR-11).
// Scaffold: behaviour comes with the AI-1329 implementation.
export const pickAmberTeam = (_groups: { name: string }[]): AmberTeam | null => null
