<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useAmberUnassignedCount } from './useAmberUnassignedCount.ts'

defineProps<{
  collapsed?: boolean
}>()

const route = useRoute()

const unassigned = useAmberUnassignedCount()
const hasUnassigned = computed(() => (unassigned.value ?? 0) > 0)

const isMac = /mac/i.test(navigator.platform || navigator.userAgent)
// A key hint, not prose.
// eslint-disable-next-line zammad/zammad-detect-translatable-string
const shortcutHint = isMac ? '⌘K' : 'Ctrl K'

const isTicketsActive = computed(() => String(route.name ?? '').startsWith('TicketOverview'))
const isSearchActive = computed(() => route.name === 'Search')
</script>

<template>
  <nav data-amber="sidebar-nav" class="flex flex-col gap-0.5" :aria-label="$t('Main navigation')">
    <RouterLink
      v-tooltip="collapsed ? $t('Search') : undefined"
      data-amber="nav-row"
      :data-active="isSearchActive || undefined"
      :to="{ name: 'Search' }"
      :aria-label="collapsed ? $t('Search') : undefined"
    >
      <CommonIcon name="search" size="tiny" decorative />
      <template v-if="!collapsed">
        <span class="grow truncate">{{ $t('Search') }}</span>
        <span data-amber="nav-hint" aria-hidden="true">{{ shortcutHint }}</span>
      </template>
    </RouterLink>

    <RouterLink
      v-tooltip="collapsed ? $t('Tickets') : undefined"
      data-amber="nav-row"
      :data-active="isTicketsActive || undefined"
      :to="{ name: 'TicketOverview' }"
      :aria-label="collapsed ? $t('Tickets') : undefined"
    >
      <CommonIcon name="all-tickets" size="tiny" decorative />
      <template v-if="!collapsed">
        <span class="grow truncate">{{ $t('Tickets') }}</span>
        <span v-if="hasUnassigned" data-amber="nav-pill">{{ $t('%s to assign', unassigned) }}</span>
      </template>
      <span v-else-if="hasUnassigned" data-amber="nav-dot" aria-hidden="true" />
    </RouterLink>
  </nav>
</template>
