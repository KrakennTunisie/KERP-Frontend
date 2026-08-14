import { buildQueryString } from "../api/query-string-builder";
import { GetAuditActivityParams, GetAuditLogsParams } from "../api/types";
import { withPrefix } from "../utils/prefixHelper";

const AUDIT_PREFIX = '/audit-service'

export const AUDIT_LOGS_ENDPOINTS = withPrefix(AUDIT_PREFIX,{
    audit_logs: (query? : GetAuditLogsParams)=> `/audit-logs${buildQueryString(query)}`,
    audit_activity: (query : GetAuditActivityParams)=> `/audit-logs/activity${buildQueryString(query)}`
});