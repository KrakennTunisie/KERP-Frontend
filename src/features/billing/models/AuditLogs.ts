import { z } from "zod";
import { InvoiceEventSourceSchema } from "../types/invoiceEventSource";
import { InvoiceEventTypeSchema } from "../types/invoiceEventType";
import { partnerSchema } from "./partner";


export const auditLogSchema = z.object({
  idLog: z.uuid().or(z.string()),
  entityName: z.string().min(1),
  entityId: z.uuid().or(z.string()),
  auditLogType: z.lazy(() => InvoiceEventTypeSchema).nullable(),
  logDate: z.date(),
  description: z.string().min(1),
  auditEventTrigger: z.lazy(() => InvoiceEventSourceSchema).nullable(),
  triggeredBy : z.string().min(1),
  partner: z.lazy(() => partnerSchema).nullable()
  
});

export type AuditLog = z.infer<typeof auditLogSchema>;