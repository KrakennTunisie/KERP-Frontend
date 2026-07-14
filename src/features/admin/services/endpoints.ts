import { buildQueryString } from "@/shared/api/query-string-builder";
import { GetListParams } from "@/shared/api/types";
import { withPrefix } from "@/shared/utils/prefixHelper"


const IAM_PREFIX = '/iam'

export const USERS_ENDPIONTS = withPrefix(IAM_PREFIX,{
    users: '/users',
    getUsers:(query? : GetListParams)=> `/users${buildQueryString(query)}`,
    getUserById:(id: string)=> `/users/${id}`,
    resetPassword: (id: string)=> `/users/${id}/password`,
    enable: (id: string)=> `/users/${id}/enable`,
    disable: (id: string)=> `/users/${id}/disable`,

});