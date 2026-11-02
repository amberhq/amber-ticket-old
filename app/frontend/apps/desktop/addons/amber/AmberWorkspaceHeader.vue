<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { computed, toRef } from 'vue'

import { useSessionStore } from '#shared/stores/session.ts'

import OnlineNotification from '#desktop/components/layout/LayoutSidebar/LeftSidebar/LeftSidebarHeader/OnlineNotification.vue'

import { useAmberTeam } from './useAmberTeam.ts'

defineProps<{
  collapsed?: boolean
}>()

const session = useSessionStore()
const user = toRef(session, 'user')

const team = useAmberTeam()

// Product name, not translated (AI-1329 FR-11).
// eslint-disable-next-line zammad/zammad-detect-translatable-string
const teamName = computed(() => team.value?.name ?? 'Amber Helpdesk')
const teamInitials = computed(() => team.value?.initials ?? 'A')

// Zammad's notification bell stays until the Notifications ticket (LLD OQ-L2).
const isTicketAgent = computed(() => session.hasPermission('ticket.agent') ?? false)
</script>

<template>
  <header
    data-amber="workspace"
    class="flex items-center gap-2.5"
    :class="{ 'flex-col': collapsed }"
  >
    <span data-amber="workspace-mark" aria-hidden="true">{{ teamInitials }}</span>
    <span v-if="!collapsed" class="flex min-w-0 grow flex-col">
      <span data-amber="workspace-name" class="truncate">{{ teamName }}</span>
      <span v-if="user?.fullname" data-amber="workspace-user" class="truncate">{{
        user.fullname
      }}</span>
    </span>
    <OnlineNotification v-if="isTicketAgent" data-amber="workspace-bell">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path
          d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"
        />
      </svg>
    </OnlineNotification>
  </header>
</template>
