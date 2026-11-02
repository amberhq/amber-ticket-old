import * as Types from '#shared/graphql/types.ts';

import gql from 'graphql-tag';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type ReactiveFunction<TParam> = () => TParam;

export const AmberCurrentUserGroupsDocument = gql`
    query amberCurrentUserGroups {
  amberCurrentUserGroups {
    id
    name
  }
}
    `;
export function useAmberCurrentUserGroupsQuery(options: VueApolloComposable.UseQueryOptions<Types.AmberCurrentUserGroupsQuery, Types.AmberCurrentUserGroupsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<Types.AmberCurrentUserGroupsQuery, Types.AmberCurrentUserGroupsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<Types.AmberCurrentUserGroupsQuery, Types.AmberCurrentUserGroupsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<Types.AmberCurrentUserGroupsQuery, Types.AmberCurrentUserGroupsQueryVariables>(AmberCurrentUserGroupsDocument, {}, options);
}
export function useAmberCurrentUserGroupsLazyQuery(options: VueApolloComposable.UseQueryOptions<Types.AmberCurrentUserGroupsQuery, Types.AmberCurrentUserGroupsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<Types.AmberCurrentUserGroupsQuery, Types.AmberCurrentUserGroupsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<Types.AmberCurrentUserGroupsQuery, Types.AmberCurrentUserGroupsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<Types.AmberCurrentUserGroupsQuery, Types.AmberCurrentUserGroupsQueryVariables>(AmberCurrentUserGroupsDocument, {}, options);
}
export type AmberCurrentUserGroupsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<Types.AmberCurrentUserGroupsQuery, Types.AmberCurrentUserGroupsQueryVariables>;