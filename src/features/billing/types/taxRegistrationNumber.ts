import { z } from "zod";

export const taxRegistrationNumberSchema = z
  .string()
  .trim()
  .min(1, "Matricule fiscal obligatoire")
  .toUpperCase()
  .refine((val) => {
    // 🇹🇳 Tunisie
    const tnRegex = /^\d{7}\/[A-Z0-9]\/\d+\/\d+$/;

    // 🇪🇺 VAT (FR, DE, IT, ES, etc.)
    const euVatRegex = /^[A-Z]{2}[A-Z0-9]{8,12}$/;

    return tnRegex.test(val) || euVatRegex.test(val);
  }, {
    message:
      "Numéro fiscal invalide (TN: 1234567/A/1/000 ou EU: FR123456789)",
  });