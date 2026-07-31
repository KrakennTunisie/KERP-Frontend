// paymentMethod.ts

// 1. Type canonique (valeurs internes, stables — utilisées en DB, API, logique métier)
export type PaymentMethod = "BANK_TRANSFER" | "CHECK" | "CASH";

// 2. Table d'alias : accepte FR/EN, avec ou sans accents/casse → PaymentMethod
const rawAliases: Record<string, PaymentMethod> = {
  // Virement
  "virement": "BANK_TRANSFER",
  "virement bancaire": "BANK_TRANSFER",
  "transfert bancaire": "BANK_TRANSFER",
  "bank transfer": "BANK_TRANSFER",
  "wire transfer": "BANK_TRANSFER",
  "BANK_TRANSFER": "BANK_TRANSFER",

  // Chèque
  "cheque": "CHECK",
  "": "CHECK",
  "cheque bancaire": "CHECK",
  "CHECK": "CHECK",
  "CB Cheque" :"CHECK",

  // Espèces
  "especes": "CASH",
  "cash": "CASH",
  "liquide": "CASH",
  "comptant": "CASH",
};


// 4. Résout n'importe quelle entrée (FR/EN) vers la valeur canonique
export function resolvePaymentMethod(input: string): PaymentMethod | null {

  return rawAliases[input] ?? null;
}
