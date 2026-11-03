import * as Types from '#shared/graphql/types.ts';

import * as Mocks from '#tests/graphql/builders/mocks.ts'
import * as Operations from './amberCurrentUserGroups.api.ts'
import * as ErrorTypes from '#shared/types/error.ts'

export function mockAmberCurrentUserGroupsQuery(defaults: Mocks.MockDefaultsValue<Types.AmberCurrentUserGroupsQuery, Types.AmberCurrentUserGroupsQueryVariables>) {
  return Mocks.mockGraphQLResult(Operations.AmberCurrentUserGroupsDocument, defaults)
}

export function waitForAmberCurrentUserGroupsQueryCalls() {
  return Mocks.waitForGraphQLMockCalls<Types.AmberCurrentUserGroupsQuery>(Operations.AmberCurrentUserGroupsDocument)
}

export function mockAmberCurrentUserGroupsQueryError(message: string, extensions: {type: ErrorTypes.GraphQLErrorTypes }) {
  return Mocks.mockGraphQLResultWithError(Operations.AmberCurrentUserGroupsDocument, message, extensions);
}
