import { apiClient } from "@/shared/api/api-client";
import {  PERMISSIONS_ENDPIONTS, ROLES_ENDPIONTS, USERS_ENDPIONTS } from "./endpoints";
import { GetExtendedListParams, GetListParams, PageResponse } from "@/shared/api/types";
import { User, UserDetails, UserResponse } from "../models/user";
import { ClientPermissions, Permission } from "../models/permission";
import { Role, RoleDTO } from "../models/role";



export const usersAPI = {
    getAllUsers: (query? : GetExtendedListParams)=> apiClient.get<PageResponse<UserResponse>>(USERS_ENDPIONTS.getUsers(query)),
    getUserById: (id: string)=> apiClient.get<User>(USERS_ENDPIONTS.getUserById(id)),
    getUserDetails: (id: string)=> apiClient.get<UserDetails>(USERS_ENDPIONTS.getUserDetails(id)),

    addUser: (payload: FormData)=> apiClient.post<User>(USERS_ENDPIONTS.users, payload),
    updateUser: (id: string, payload: FormData)=> apiClient.put<UserResponse>(USERS_ENDPIONTS.getUserById(id), payload),

    updateUserRole: (id: string, roleName: string)=> apiClient.patch<void>(USERS_ENDPIONTS.usersRole(id, roleName)),

    enableUser: (id: string)=> apiClient.patch<void>(USERS_ENDPIONTS.enable(id)),
    disableUser: (id: string)=> apiClient.patch<void>(USERS_ENDPIONTS.disable(id)),
    deleteUser:(id: string)=> apiClient.post<User>(USERS_ENDPIONTS.getUserById(id)),
    
    resetPassword: (id: string, formData:FormData)=>apiClient.post(USERS_ENDPIONTS.resetPassword(id), formData)

}

export const rolesAPI = {

    getRoles:()=>apiClient.get<RoleDTO[]>(ROLES_ENDPIONTS.getAllRoles),

    getAllRoles: (query? : GetListParams)=> apiClient.get<PageResponse<Role>>(ROLES_ENDPIONTS.getroles(query)),
    getRoleById: (id: string)=> apiClient.post<Role>(ROLES_ENDPIONTS.getRoleById(id)),
    getRoleByName: (name: string)=> apiClient.post<Role>(ROLES_ENDPIONTS.getRoleByName(name)),

    addPermissionsToRole: (roleName: string, payload: FormData) => apiClient.post<Role>(ROLES_ENDPIONTS.rolePermissions(roleName), payload),
    revokePermissionRole : (roleName: string, clientId: string, permissionName: string)=>
        apiClient.delete<void>(ROLES_ENDPIONTS.revokePermission(roleName, clientId, permissionName)),

    addRole: (payload: FormData)=> apiClient.post<Role>(ROLES_ENDPIONTS.roles, payload),
    updateRole: (id: string, payload: FormData)=> apiClient.post<Role>(ROLES_ENDPIONTS.getRoleById(id), payload),

    enableRole: (id: string)=> apiClient.post<Role>(ROLES_ENDPIONTS.getRoleById(id)),
    disableRole: (id: string)=> apiClient.post<Role>(ROLES_ENDPIONTS.getRoleById(id)),
    deleteRole:(id: string)=> apiClient.post<Role>(ROLES_ENDPIONTS.getRoleById(id)),
}



export const permissionsAPI = {
    getAllPermissions: (query? : GetListParams)=> apiClient.get<PageResponse<ClientPermissions>>(PERMISSIONS_ENDPIONTS.getClientPermissions(query)),
    getPermissionById: (id: string)=> apiClient.post<Permission>(PERMISSIONS_ENDPIONTS.getPermissionById(id)),


}