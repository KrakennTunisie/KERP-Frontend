import { withPrefix } from "@/shared/utils/prefixHelper";


const IAM_PREFIX = '/iam'
export const RESET_PASSWORD_ENDPOINTS = withPrefix(IAM_PREFIX,{
    forget_password: '/forgot-password',
    forget_password_request: `/forgot-password/request`,
    forget_password_verify:`/forgot-password/verify`,
    forget_password_reset: `/forgot-password/reset`,
});