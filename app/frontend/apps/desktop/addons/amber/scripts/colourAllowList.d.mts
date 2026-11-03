// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

export declare const normaliseRgba: (
  r: string | number,
  g: string | number,
  b: string | number,
  a: string | number,
) => string

export declare const buildAllowList: (tokensCss: string) => Set<string>
