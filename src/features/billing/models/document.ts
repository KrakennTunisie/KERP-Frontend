import { z } from "zod";


export const documentSchema = z.object({
  idDocument: z.uuid().or(z.string()),
  fileName: z.string().min(1),
  mimeType: z.string().min(1).optional(),
  storageURL: z.string().min(1).optional(),
  hash: z.string().optional(),
});
export type Document = z.infer<typeof documentSchema>;