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

export const ROLES_ENDPIONTS = withPrefix(IAM_PREFIX,{
    roles: '/roles',
    getroles:(query? : GetListParams)=> `/roles${buildQueryString(query)}`,
    getRoleById:(id: string)=> `/roles/${id}`,
    getRoleByName:(name: string)=> `/roles/${name}`,
    rolePermissions:(name:string)=>`/roles/${name}/permissions`,
    revokePermission: (roleName: string, clientId: string, permissionName: string)=>
        `/roles/${roleName}/permissions/${clientId}/${permissionName}`,
    enable: (id: string)=> `/roles/${id}/enable`,
    disable: (id: string)=> `/roles/${id}/disable`,

});

export const PERMISSIONS_ENDPIONTS = withPrefix(IAM_PREFIX,{
    permissions: '/permissions',
    getClientPermissions:(query? : GetListParams)=> `/permissions${buildQueryString(query)}`,
    getPermissionById:(id: string)=> `/users/${id}`,


});