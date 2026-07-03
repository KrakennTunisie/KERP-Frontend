import { z } from "zod";
import { InvoiceEventSourceSchema } from "../types/invoiceEventSource";
import { InvoiceEventTypeSchema, UserEventTypeSchema } from "../types/invoiceEventType";
import { partnerSchema } from "./partner";
import { AuditEntitySchema } from "../types/auditEntity";


export const AuditLogEventTypeSchema = z.union([
  InvoiceEventTypeSchema,
  UserEventTypeSchema,
]);

export type AuditLogEventType = z.infer<typeof AuditLogEventTypeSchema>;

export const auditLogSchema = z.object({
  idLog: z.uuid().or(z.string()),
  entityName: AuditEntitySchema,
  entityId: z.uuid().or(z.string()),
  auditLogType: z.lazy(() => AuditLogEventTypeSchema).nullable(),
  logDate: z.date(),
  description: z.string().min(1),
  auditEventTrigger: z.lazy(() => InvoiceEventSourceSchema).nullable(),
  triggeredBy : z.string().min(1),
  partner: z.lazy(() => partnerSchema).nullable()
  
});

export type AuditLog = z.infer<typeof auditLogSchema>;

export const mockAuditLogs: AuditLog[] = [
  {
    idLog: "log-001",
    entityName: "USER",
    entityId: "user-001",
    auditLogType: UserEventTypeSchema.enum.UPDATED,
    logDate: new Date("2026-06-23T10:15:00Z"),
    description: "User profile updated successfully",
    auditEventTrigger: InvoiceEventSourceSchema.enum.USER,
    triggeredBy: "admin@company.com",
    partner: null,
  },
  {
    idLog: "log-002",
    entityName: "USER",
    entityId: "user-001",
    auditLogType: UserEventTypeSchema.enum.PASSWORD_RESET_REQUESTED,
    logDate: new Date("2026-06-22T18:40:00Z"),
    description: "Password reset requested",
    auditEventTrigger: InvoiceEventSourceSchema.enum.USER,
    triggeredBy: "system",
    partner: null,
  },
  {
    idLog: "log-003",
    entityName: "USER",
    entityId: "user-001",
    auditLogType: UserEventTypeSchema.enum.LOGIN_SUCCEEDED,
    logDate: new Date("2026-06-22T09:12:00Z"),
    description: "User logged in successfully",
    auditEventTrigger: InvoiceEventSourceSchema.enum.USER,
    triggeredBy: "mobile_app",
    partner: null,
  },
  {
    idLog: "log-004",
    entityName: "USER",
    entityId: "user-001",
    auditLogType: UserEventTypeSchema.enum.ROLE_ASSIGNED,
    logDate: new Date("2026-06-21T14:33:00Z"),
    description: "Role assigned: ADMIN",
    auditEventTrigger: InvoiceEventSourceSchema.enum.USER,
    triggeredBy: "admin@company.com",
    partner: null,
  },
  {
    idLog: "log-005",
    entityName: "USER",
    entityId: "user-001",
    auditLogType: UserEventTypeSchema.enum.CREATED,
    logDate: new Date("2026-06-20T08:05:00Z"),
    description: "User created",
    auditEventTrigger: InvoiceEventSourceSchema.enum.SYSTEM,
    triggeredBy: "system",
    partner: null,
  },

  {
    idLog: "log-006",
    entityName: "USER",
    entityId: "user-001",
    auditLogType: UserEventTypeSchema.enum.EMAIL_CHANGED,
    logDate: new Date("2026-06-19T16:22:00Z"),
    description: "Email updated",
    auditEventTrigger: InvoiceEventSourceSchema.enum.USER,
    triggeredBy: "user_self",
    partner: null,
  },

  {
    idLog: "log-007",
    entityName: "USER",
    entityId: "user-001",
    auditLogType: UserEventTypeSchema.enum.LOGIN_FAILED,
    logDate: new Date("2026-06-18T11:10:00Z"),
    description: "Login attempt failed (wrong password)",
    auditEventTrigger: InvoiceEventSourceSchema.enum.SYSTEM,
    triggeredBy: "web_app",
    partner: null,
  },

  {
    idLog: "log-008",
    entityName: "USER",
    entityId: "user-001",
    auditLogType: UserEventTypeSchema.enum.ACTIVATED,
    logDate: new Date("2026-06-17T09:45:00Z"),
    description: "User status changed to ACTIVE",
    auditEventTrigger: InvoiceEventSourceSchema.enum["AI AGENT"],
    triggeredBy: "admin@company.com",
    partner: null,
  },
];