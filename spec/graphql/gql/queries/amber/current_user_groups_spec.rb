# Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'

# AI-1329 test-case.md TC-43 (as a spec), TC-45 and TC-46. Described by name: the query class
# doesn't exist until the AI-1329 implementation.
RSpec.describe 'Gql::Queries::Amber::CurrentUserGroups', type: :graphql do
  let(:query) do
    <<~QUERY
      query amberCurrentUserGroups {
        amberCurrentUserGroups {
          id
          name
        }
      }
    QUERY
  end

  let(:finance)  { create(:group, name: 'Finance') }
  let(:ops)      { create(:group, name: 'Ops Forms') }
  let(:inactive) { create(:group, name: 'Archive', active: false) }

  before do
    gql.execute(query)
  end

  context 'with an agent in two groups', authenticated_as: :agent do
    let(:agent) { create(:agent, groups: [ops, finance]) }

    it 'TC-43: returns the groups ordered by name' do
      expect(gql.result.data).to eq([
                                      { 'id' => gql.id(finance), 'name' => 'Finance' },
                                      { 'id' => gql.id(ops), 'name' => 'Ops Forms' },
                                    ])
    end
  end

  context 'with an agent in an inactive group', authenticated_as: :agent do
    let(:agent) { create(:agent, groups: [inactive, finance]) }

    it 'TC-46: returns only active groups' do
      expect(gql.result.data.pluck('name')).to eq(['Finance'])
    end
  end

  context 'with a customer', authenticated_as: :customer do
    let(:customer) { create(:customer) }

    it 'TC-45: is forbidden' do
      expect(gql.result.error_type).to eq(Exceptions::Forbidden)
    end
  end
end
