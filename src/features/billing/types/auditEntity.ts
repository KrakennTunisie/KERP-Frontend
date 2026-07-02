import { z } from "zod";


export const AuditEntitySchema = z.enum([
  "INVOICE",
  "USER",
]);

export type AuditEntity = z.infer<typeof AuditEntitySchema>;