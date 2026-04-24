import {  z } from "zod";
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 5MB

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png"
];

export const fileSchema = z
  .instanceof(File, { message: "Fichier obligatoire" })
  .refine((file) => file.size <= MAX_FILE_SIZE, "Le fichier doit être inférieur à 5MB")
  .refine(
    (file) => ACCEPTED_TYPES.includes(file.type),
    "Format accepté : PDF, JPG, PNG"
  );
export type FileSchema = z.infer<typeof fileSchema>;
