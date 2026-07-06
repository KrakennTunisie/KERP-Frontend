import { z } from 'zod'

export const InvoiceEventTypeSchema = z.enum([
  'CREATED',
  'UPDATED',
  'DELETED',
  'STATUS_CHANGED',
  'PAYMENT_REGISTERED',
  'PAYMENT_METHOD_UPDATED',
  'CANCELLED',
  'DOCUMENT_ATTACHED',
  'DOCUMENT_VALIDATED',
  'SIGNATURE_REQUESTED',
  'SIGNATURE_SUCCEEDED',
  'SIGNATURE_FAILED',
  'TTN_SUBMISSION_REQUESTED',
  'TTN_SUBMITTED',
  'TTN_ACCEPTED',
  'TTN_REJECTED',
  'FX_RATE_APPLIED',
])

export const UserEventTypeSchema = z.enum([
  "CREATED",
  "UPDATED",
  "DELETED",
  "ACTIVATED",
  "DEACTIVATED",
  "BLOCKED",
  "UNBLOCKED",
  "ROLE_ASSIGNED",
  "ROLE_REMOVED",
  "PASSWORD_RESET_REQUESTED",
  "PASSWORD_RESET",
  "PASSWORD_CHANGED",
  "EMAIL_CHANGED",
  "LOGIN_SUCCEEDED",
  "LOGIN_FAILED",
  "LOGOUT",
]);

export type UserEventType = z.infer<typeof UserEventTypeSchema>;

export const UserEventTypeLabels: Record<UserEventType, string> = {
  CREATED: "Création",
  UPDATED: "Modification",
  DELETED: "Suppression",
  ACTIVATED: "Activation",
  DEACTIVATED: "Désactivation",
  BLOCKED: "Blocage",
  UNBLOCKED: "Déblocage",
  ROLE_ASSIGNED: "Attribution d'un rôle",
  ROLE_REMOVED: "Retrait d'un rôle",
  PASSWORD_RESET_REQUESTED: "Demande de réinitialisation du mot de passe",
  PASSWORD_RESET: "Réinitialisation du mot de passe",
  PASSWORD_CHANGED: "Changement du mot de passe",
  EMAIL_CHANGED: "Modification de l'adresse e-mail",
  LOGIN_SUCCEEDED: "Connexion réussie",
  LOGIN_FAILED: "Échec de connexion",
  LOGOUT: "Déconnexion",
};

export type InvoiceEventType = z.infer<typeof InvoiceEventTypeSchema>

export const InvoiceEventLabels: Record<InvoiceEventType, string> = {
    CREATED: "Facture a été créée",
    UPDATED: "Mis à jour",
    DELETED : "Supprimée",
    STATUS_CHANGED:"Status changée",
    PAYMENT_REGISTERED:"Paiement enregistrée",
    PAYMENT_METHOD_UPDATED:"Méthode de paiement mis à jour",
    CANCELLED:"Annulée",
    DOCUMENT_ATTACHED:"Document Attachée",
    DOCUMENT_VALIDATED:"Document validée",
    SIGNATURE_REQUESTED:"Demande une signature",
    SIGNATURE_SUCCEEDED:"Succées de la signature",
    SIGNATURE_FAILED:"Echéc de la signature",
    TTN_SUBMISSION_REQUESTED:"Soumission à TTN demandée",
    TTN_SUBMITTED:"TTN a soumis la facture",
    TTN_ACCEPTED:"TTN a acceptée la facture",
    TTN_REJECTED:"TTN a rejetée la facture",
    FX_RATE_APPLIED:"Taux d'échange a été appliquée"

};