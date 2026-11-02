// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { computed } from 'vue'

import { QueryHandler } from '#shared/server/apollo/handler/index.ts'

import { useAmberCurrentUserGroupsQuery } from './graphql/queries/amberCurrentUserGroups.api.ts'

export interface AmberTeam {
  name: string
  initials: string
}

// The team shown in the sidebar header: the agent's first group by name (AI-1329 FR-11).
export const pickAmberTeam = (groups: { name?: string | null }[]): AmberTeam | null => {
  const [name] = groups
    .map((group) => group.name?.trim())
    .filter((groupName): groupName is string => !!groupName)
    .sort((a, b) => a.localeCompare(b))
  if (!name) return null

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')

  return { name, initials }
}

// On error there is no team, and the header shows its fallback; no notification is raised.
export const useAmberTeam = () => {
  const query = new QueryHandler(useAmberCurrentUserGroupsQuery({ fetchPolicy: 'cache-first' }), {
    errorShowNotification: false,
  })
  const result = query.result()

  return computed(() => pickAmberTeam(result.value?.amberCurrentUserGroups ?? []))
}
