import { apiClient } from "@/shared/api/api-client";
import {  USERS_ENDPIONTS } from "./endpoints";
import { User } from "@/features/admin/mocks/mock-users";
import { GetListParams, PageResponse } from "@/shared/api/types";



export const usersAPI = {
    getAllUsers: (query? : GetListParams)=> apiClient.get<PageResponse<User>>(USERS_ENDPIONTS.getUsers(query)),
    getUserById: (id: string)=> apiClient.post<User>(USERS_ENDPIONTS.getUserById(id)),

    addUser: (payload: FormData)=> apiClient.post<User>(USERS_ENDPIONTS.users, payload),
    updateUser: (id: string, payload: FormData)=> apiClient.post<User>(USERS_ENDPIONTS.getUserById(id), payload),

    enableUser: (id: string)=> apiClient.post<User>(USERS_ENDPIONTS.getUserById(id)),
    disableUser: (id: string)=> apiClient.post<User>(USERS_ENDPIONTS.getUserById(id)),
    deleteUser:(id: string)=> apiClient.post<User>(USERS_ENDPIONTS.getUserById(id)),
    
    resetPassword: (id: string, formData:FormData)=>apiClient.post(USERS_ENDPIONTS.resetPassword(id), formData)

}