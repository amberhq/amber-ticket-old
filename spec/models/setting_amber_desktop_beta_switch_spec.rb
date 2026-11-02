# Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'

# AI-1329 test-case.md TC-27: the beta switch must stay off. While it's off, Zammad hides the
# BETA bar, the feedback prompts and the "New BETA UI" personal setting (FR-17).
RSpec.describe Setting, type: :model do
  it 'TC-27: ui_desktop_beta_switch is off after seeding' do
    expect(described_class.get('ui_desktop_beta_switch')).to be(false)
  end
end
