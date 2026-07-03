import { apiClient } from "@/shared/api/api-client";
import { LoginRequest } from "../types/loginRequest";
import { AUTH_ENDPOINTS } from "./endpoints";
import { User } from "@/features/admin/mocks/mock-users";



export const authAPI = {
    login: (loginRequest: LoginRequest)=> apiClient.post<User>(AUTH_ENDPOINTS.login, loginRequest),
    logout: ()=> apiClient.post(AUTH_ENDPOINTS.logout),
    me: ()=> apiClient.get<User>(AUTH_ENDPOINTS.me),

    sendResetEmail: (formData:FormData)=>apiClient.post(AUTH_ENDPOINTS.sendResteEmail, formData),
    verifyCode: (formData:FormData)=>apiClient.post(AUTH_ENDPOINTS.verifyResetCode, formData),
    resetPassword: (formData:FormData)=>apiClient.post(AUTH_ENDPOINTS.resetPassword, formData)

}