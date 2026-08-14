import { apiClient } from "../api/api-client";
import { getApiErrorMessage } from "../api/handle-api-error";
import { GetAuditActivityParams, GetAuditLogsParams, PageResponse } from "../api/types";
import { AuditLogView, HeatmapItem } from "./AuditLog";
import { AUDIT_LOGS_ENDPOINTS } from "./auditLogEndpoints";

export const auditLogsAPI = {
    getAuditLogs: (query? : GetAuditLogsParams)=> apiClient.get<PageResponse<AuditLogView>>(AUDIT_LOGS_ENDPOINTS.audit_logs(query)),
    getAuditActivity: (query : GetAuditActivityParams)=> apiClient.get<HeatmapItem[]>(AUDIT_LOGS_ENDPOINTS.audit_activity(query))
}

export const auditLogService = {
  async getAuditLogs(
    params?: GetAuditLogsParams
  ): Promise<PageResponse<AuditLogView>> {
    try {
        return await auditLogsAPI.getAuditLogs(params)
    } catch (error) {
        throw new Error(getApiErrorMessage(error))
    }
  },
    async getAuditActivity(
    params: GetAuditActivityParams
  ): Promise<HeatmapItem[]> {
    try {
        return await auditLogsAPI.getAuditActivity(params)
    } catch (error) {
        throw new Error(getApiErrorMessage(error))
    }
  },
};
