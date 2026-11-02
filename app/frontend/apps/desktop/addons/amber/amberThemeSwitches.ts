// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

// Zammad's two theme switches are hidden: the app is light-only (AI-1329 FR-7).

// Avatar menu: the "Appearance" item.
export const withoutAppearanceItem = <T extends { key: string }>(items: T[]) =>
  items.filter((item) => item.key !== 'appearance')

// Personal settings menu: the "Appearance" page, per category.
export const withoutAppearancePage = <T extends { route: { name: string } }>(
  entries: Record<string, T[]>,
) =>
  Object.fromEntries(
    Object.entries(entries).map(([category, items]) => [
      category,
      items.filter((item) => item.route.name !== 'PersonalSettingAppearance'),
    ]),
  )
