import { apiClient } from "@/shared/api/api-client";
import { RESET_PASSWORD_ENDPOINTS } from "./endpoints";
import { ForgotPasswordRequest, ResetPasswordRequest, VerifyOtpRequest, VerifyOtpResponse } from "../types/resetPasswordRequest";

export const ResetPasswordAPI = {
    
    sendResetEmail: (formData:ForgotPasswordRequest)=>apiClient.post(RESET_PASSWORD_ENDPOINTS.forget_password_request, formData),
    verifyCode: (formData:VerifyOtpRequest)=>apiClient.post<VerifyOtpResponse>(RESET_PASSWORD_ENDPOINTS.forget_password_verify, formData),
    resetPassword: (formData:ResetPasswordRequest)=>apiClient.post(RESET_PASSWORD_ENDPOINTS.forget_password_reset, formData)

}