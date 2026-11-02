# Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

module Gql::Queries
  class Amber::CurrentUserGroups < BaseQuery

    description 'Active groups the current agent can read, ordered by name (Amber sidebar team header)'

    type [Gql::Types::GroupType, { null: false }], null: false

    requires_permission 'ticket.agent'

    def resolve
      Group.where(id: context.current_user.group_ids_access('read'), active: true).reorder(:name)
    end
  end
end
