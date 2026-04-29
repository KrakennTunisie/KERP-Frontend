import { z } from "zod";

export const SendMailSchema = z.object({
  toEmail: z.email("Email invalide"),
  subject: z.string().min(1, "Le sujet est obligatoire"),
  body: z.string().min(1, "Le contenu est obligatoire"),
});

export type SendMail = z.infer<typeof SendMailSchema>;