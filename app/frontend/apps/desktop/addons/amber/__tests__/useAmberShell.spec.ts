// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { renderComponent } from '#tests/support/components/index.ts'

import AmberWorkspaceHeader from '../AmberWorkspaceHeader.vue'
import { buildAllowList } from '../scripts/colourAllowList.mjs'
import { isAmberSearchShortcut } from '../useAmberSearchShortcut.ts'
import { pickAmberTeam } from '../useAmberTeam.ts'
import { amberUnassignedCount } from '../useAmberUnassignedCount.ts'

// AI-1329 test-case.md Unit rows. Each test is named after its row ID so dev-qa can map results back.

describe('AI-1329 Amber shell', () => {
  it('TC-3: colour allow-list holds the Amber palette and no Zammad defaults', () => {
    const css = readFileSync(
      resolve(__dirname, '../../../styles/custom/amber/10-tokens.css'),
      'utf8',
    )
    const allowed = buildAllowList(css)

    // FR-1 neutrals, one FR-2 pair, and an FR-3 state dot.
    ;['#171717', '#ffffff', '#f3f3f3', '#f8f8f8', '#ededed', '#d4d4d4'].forEach((colour) =>
      expect(allowed).toContain(colour),
    )
    ;['#fdecec', '#9f1d17'].forEach((colour) => expect(allowed).toContain(colour))
    expect(allowed).toContain('#2563eb')
    expect(allowed).not.toContain('#23a2cd')
  })

  it('TC-18: the team is the first group by name, with its initials', () => {
    expect(pickAmberTeam([{ name: 'Ops Forms' }, { name: 'Finance' }])).toEqual({
      name: 'Finance',
      initials: 'F',
    })
    expect(pickAmberTeam([{ name: 'Ops' }])).toEqual({ name: 'Ops', initials: 'O' })
    expect(pickAmberTeam([{ name: 'Ops Forms' }])).toEqual({ name: 'Ops Forms', initials: 'OF' })
    expect(pickAmberTeam([])).toBeNull()
  })

  it('TC-21: the to-assign count comes from the all_unassigned overview', () => {
    const overview = { id: 'gid://zammad/Overview/2' }

    expect(amberUnassignedCount({}, {})).toBeNull()
    expect(amberUnassignedCount({ all_unassigned: overview }, { [overview.id]: 0 })).toBe(0)
    expect(amberUnassignedCount({ all_unassigned: overview }, { [overview.id]: 12 })).toBe(12)
  })

  describe('TC-24: ⌘K / Ctrl+K opens search', () => {
    afterEach(() => {
      document.body.innerHTML = ''
    })

    const key = (init: KeyboardEventInit) => new KeyboardEvent('keydown', { key: 'k', ...init })

    it('fires for ⌘K and Ctrl+K only', () => {
      expect(isAmberSearchShortcut(key({ metaKey: true }))).toBe(true)
      expect(isAmberSearchShortcut(key({ ctrlKey: true }))).toBe(true)
      expect(isAmberSearchShortcut(key({}))).toBe(false)
    })

    it('ignores the shortcut while a dialog has focus', () => {
      document.body.innerHTML = '<div role="dialog"><button>Close</button></div>'
      document.querySelector('button')?.focus()

      expect(isAmberSearchShortcut(key({ metaKey: true }))).toBe(false)
    })
  })

  it('TC-26: the team header falls back to "Amber Helpdesk" with no team', () => {
    const view = renderComponent(AmberWorkspaceHeader, { store: true })

    expect(view.getByText('Amber Helpdesk')).toBeInTheDocument()
  })
})
