import { z } from "zod";

export const ibanSchema = z
  .string()
  .trim()
  .min(1, "IBAN obligatoire")
  .transform((val) => val.replace(/\s+/g, "").toUpperCase())
  .refine((val) => /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(val), {
    message: "IBAN invalide",
  });