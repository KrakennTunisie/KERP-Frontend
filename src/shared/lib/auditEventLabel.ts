import { AuditLogEventType } from "@/features/billing/models/AuditLogs";
import { AuditEntity } from "@/features/billing/types/auditEntity";
import { InvoiceEventLabels, InvoiceEventType, UserEventType, UserEventTypeLabels } from "@/features/billing/types/invoiceEventType";

export function getAuditEventLabel(
  entity: AuditEntity,
  event: AuditLogEventType
) {
  switch (entity) {
    case "INVOICE":
      return InvoiceEventLabels[event as InvoiceEventType];

    case "USER":
      return UserEventTypeLabels[event as UserEventType];

    default:
      return event;
  }
}