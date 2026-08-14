export interface AuditLogView {
  id: string;
  correlationId: string | null;
  timestamp: string;
  sourceService: string;
  actor: Actor;
  action: string;
  resourceType: string;
  resourceId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  outcome: string | null;
  failureReason: string | null;
  enversRevision: number | null;
}

export interface Actor {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
}

export type HeatmapItem = { date: string; count: number };


export enum AuditAction {
  // Users
  USER_CREATED = "USER_CREATED",
  USER_UPDATED = "USER_UPDATED",
  USER_DELETED = "USER_DELETED",
  USER_ENABLED = "USER_ENABLED",
  USER_DISABLED = "USER_DISABLED",
  USER_PASSWORD_CHANGED = "USER_PASSWORD_CHANGED",
  USER_ROLE_ASSIGNED = "USER_ROLE_ASSIGNED",
  USER_ROLE_REMOVED = "USER_ROLE_REMOVED",

  // Invoices
  INVOICE_CREATED = "INVOICE_CREATED",
  INVOICE_UPDATED = "INVOICE_UPDATED",
  INVOICE_DELETED = "INVOICE_DELETED",
  INVOICE_ISSUED = "INVOICE_ISSUED",
  INVOICE_SENT = "INVOICE_SENT",
  INVOICE_VIEWED = "INVOICE_VIEWED",
  INVOICE_CANCELLED = "INVOICE_CANCELLED",
  INVOICE_PAID = "INVOICE_PAID",
  INVOICE_PARTIALLY_PAID = "INVOICE_PARTIALLY_PAID",
  INVOICE_MARKED_OVERDUE = "INVOICE_MARKED_OVERDUE",
  INVOICE_REFUNDED = "INVOICE_REFUNDED",
  INVOICE_ARCHIVED = "INVOICE_ARCHIVED",

  // Credit notes
  CREDIT_NOTE_CREATED = "CREDIT_NOTE_CREATED",
  CREDIT_NOTE_UPDATED = "CREDIT_NOTE_UPDATED",
  CREDIT_NOTE_DELETED = "CREDIT_NOTE_DELETED",
  CREDIT_NOTE_ISSUED = "CREDIT_NOTE_ISSUED",
  CREDIT_NOTE_SENT = "CREDIT_NOTE_SENT",
  CREDIT_NOTE_CANCELLED = "CREDIT_NOTE_CANCELLED",
  CREDIT_NOTE_APPLIED = "CREDIT_NOTE_APPLIED",
  CREDIT_NOTE_REFUNDED = "CREDIT_NOTE_REFUNDED",
  CREDIT_NOTE_ARCHIVED = "CREDIT_NOTE_ARCHIVED",

  // Partners
  PARTNER_CREATED = "PARTNER_CREATED",
  PARTNER_UPDATED = "PARTNER_UPDATED",
  PARTNER_DELETED = "PARTNER_DELETED",
  PARTNER_ENABLED = "PARTNER_ENABLED",
  PARTNER_DISABLED = "PARTNER_DISABLED",

  // Payments
  PAYMENT_CREATED = "PAYMENT_CREATED",
  PAYMENT_UPDATED = "PAYMENT_UPDATED",
  PAYMENT_DELETED = "PAYMENT_DELETED",
  PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  PAYMENT_CANCELLED = "PAYMENT_CANCELLED",
  PAYMENT_REFUNDED = "PAYMENT_REFUNDED",
  PAYMENT_REVERSED = "PAYMENT_REVERSED",

  // Purchase orders
  PURCHASE_ORDER_CREATED = "PURCHASE_ORDER_CREATED",
  PURCHASE_ORDER_UPDATED = "PURCHASE_ORDER_UPDATED",
  PURCHASE_ORDER_DELETED = "PURCHASE_ORDER_DELETED",
  PURCHASE_ORDER_SUBMITTED = "PURCHASE_ORDER_SUBMITTED",
  PURCHASE_ORDER_APPROVED = "PURCHASE_ORDER_APPROVED",
  PURCHASE_ORDER_REJECTED = "PURCHASE_ORDER_REJECTED",
  PURCHASE_ORDER_CANCELLED = "PURCHASE_ORDER_CANCELLED",
  PURCHASE_ORDER_RECEIVED = "PURCHASE_ORDER_RECEIVED",
  PURCHASE_ORDER_COMPLETED = "PURCHASE_ORDER_COMPLETED",
  PURCHASE_ORDER_ARCHIVED = "PURCHASE_ORDER_ARCHIVED",
}

export const auditActionLabels: Record<AuditAction, string> = {
  // Users
  [AuditAction.USER_CREATED]: "Utilisateur créé",
  [AuditAction.USER_UPDATED]: "Utilisateur modifié",
  [AuditAction.USER_DELETED]: "Utilisateur supprimé",
  [AuditAction.USER_ENABLED]: "Utilisateur activé",
  [AuditAction.USER_DISABLED]: "Utilisateur désactivé",
  [AuditAction.USER_PASSWORD_CHANGED]: "Mot de passe utilisateur modifié",
  [AuditAction.USER_ROLE_ASSIGNED]: "Rôle attribué à l'utilisateur",
  [AuditAction.USER_ROLE_REMOVED]: "Rôle retiré à l'utilisateur",

  // Invoices
  [AuditAction.INVOICE_CREATED]: "Facture créée",
  [AuditAction.INVOICE_UPDATED]: "Facture modifiée",
  [AuditAction.INVOICE_DELETED]: "Facture supprimée",
  [AuditAction.INVOICE_ISSUED]: "Facture émise",
  [AuditAction.INVOICE_SENT]: "Facture envoyée",
  [AuditAction.INVOICE_VIEWED]: "Facture consultée",
  [AuditAction.INVOICE_CANCELLED]: "Facture annulée",
  [AuditAction.INVOICE_PAID]: "Facture payée",
  [AuditAction.INVOICE_PARTIALLY_PAID]: "Facture partiellement payée",
  [AuditAction.INVOICE_MARKED_OVERDUE]: "Facture marquée comme impayée",
  [AuditAction.INVOICE_REFUNDED]: "Facture remboursée",
  [AuditAction.INVOICE_ARCHIVED]: "Facture archivée",

  // Credit notes
  [AuditAction.CREDIT_NOTE_CREATED]: "Avoir créé",
  [AuditAction.CREDIT_NOTE_UPDATED]: "Avoir modifié",
  [AuditAction.CREDIT_NOTE_DELETED]: "Avoir supprimé",
  [AuditAction.CREDIT_NOTE_ISSUED]: "Avoir émis",
  [AuditAction.CREDIT_NOTE_SENT]: "Avoir envoyé",
  [AuditAction.CREDIT_NOTE_CANCELLED]: "Avoir annulé",
  [AuditAction.CREDIT_NOTE_APPLIED]: "Avoir appliqué",
  [AuditAction.CREDIT_NOTE_REFUNDED]: "Avoir remboursé",
  [AuditAction.CREDIT_NOTE_ARCHIVED]: "Avoir archivé",

  // Partners
  [AuditAction.PARTNER_CREATED]: "Partenaire créé",
  [AuditAction.PARTNER_UPDATED]: "Partenaire modifié",
  [AuditAction.PARTNER_DELETED]: "Partenaire supprimé",
  [AuditAction.PARTNER_ENABLED]: "Partenaire activé",
  [AuditAction.PARTNER_DISABLED]: "Partenaire désactivé",

  // Payments
  [AuditAction.PAYMENT_CREATED]: "Paiement créé",
  [AuditAction.PAYMENT_UPDATED]: "Paiement modifié",
  [AuditAction.PAYMENT_DELETED]: "Paiement supprimé",
  [AuditAction.PAYMENT_CONFIRMED]: "Paiement confirmé",
  [AuditAction.PAYMENT_FAILED]: "Échec du paiement",
  [AuditAction.PAYMENT_CANCELLED]: "Paiement annulé",
  [AuditAction.PAYMENT_REFUNDED]: "Paiement remboursé",
  [AuditAction.PAYMENT_REVERSED]: "Paiement contre-passé",

  // Purchase orders
  [AuditAction.PURCHASE_ORDER_CREATED]: "Bon de commande créé",
  [AuditAction.PURCHASE_ORDER_UPDATED]: "Bon de commande modifié",
  [AuditAction.PURCHASE_ORDER_DELETED]: "Bon de commande supprimé",
  [AuditAction.PURCHASE_ORDER_SUBMITTED]: "Bon de commande soumis",
  [AuditAction.PURCHASE_ORDER_APPROVED]: "Bon de commande approuvé",
  [AuditAction.PURCHASE_ORDER_REJECTED]: "Bon de commande rejeté",
  [AuditAction.PURCHASE_ORDER_CANCELLED]: "Bon de commande annulé",
  [AuditAction.PURCHASE_ORDER_RECEIVED]: "Bon de commande réceptionné",
  [AuditAction.PURCHASE_ORDER_COMPLETED]: "Bon de commande terminé",
  [AuditAction.PURCHASE_ORDER_ARCHIVED]: "Bon de commande archivé",
};

export const getAuditActionLabel = (action: string): string => {
  return auditActionLabels[action as AuditAction] ?? action;
};