import { z } from "zod";

// --- Status schema ---
export const EmailStatusSchema = z.enum(["CREATED", "SENT", "FAILED"]);
export type EmailStatus = z.infer<typeof EmailStatusSchema>;
// Define attachment type separately
export const EmailAttachmentSchema = z.object({
  id: z.uuid(),        // attachment ID
  fileName: z.string(),
  filePath: z.string(),
});

// EmailLog schema
export const EmailLogSchema = z.object({
  idMailJob: z.uuid(),
  subject: z.string(),
  date: z.date(),
  status: EmailStatusSchema, // adapt your status enum here
  attachments: z.array(EmailAttachmentSchema),
});

export const EmailLogDetailsSchema = EmailLogSchema.extend({
  body: z.string(),
  to: z.string()
});

// TypeScript types inferred from Zod
export type EmailAttachment = z.infer<typeof EmailAttachmentSchema>;
export type EmailLog = z.infer<typeof EmailLogSchema>;
export type EmailLogDetails = z.infer<typeof EmailLogDetailsSchema>;

 export const getEmailStatusColor = (status: EmailStatus) => {
    switch (status) {
      case 'CREATED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'SENT': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'FAILED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  export const getStatusLabel = (status: EmailStatus) => {
    const labels: Record<EmailStatus, string> = {
      CREATED: 'Créé',
      SENT: 'Envoyé',
      FAILED: 'Échoué',
    };
    return labels[status] || status;
  };