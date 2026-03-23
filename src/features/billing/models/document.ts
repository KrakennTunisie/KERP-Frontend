import { z } from "zod";
import { documentStorageMode } from "../types/documentStorageMode";


export const documentSchema = z.object({
  idDocument: z.uuid().or(z.string()),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  storageURL: z.string().min(1),
  hash: z.string(),
  storageMode: documentStorageMode,
  
});
export type Document = z.infer<typeof documentSchema>;