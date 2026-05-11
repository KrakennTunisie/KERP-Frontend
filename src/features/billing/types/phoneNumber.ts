import { z } from "zod";


export const phoneNumberSchema = z
  .string()
  .trim()
  .min(1, "Numéro téléphone obligatoire")
  .refine((val) => {
    // 🇹🇳 local
    const tnLocal = /^[259]\d{7}$/;

    // 🌍 international (+216, +33, +49, etc.)
    const intl = /^\+?[1-9]\d{7,14}$/;

    return tnLocal.test(val) || intl.test(val);
  }, {
    message:
      "Numéro invalide (ex: 12345678 ou +21612345678 ou +33123456789)",
  });

