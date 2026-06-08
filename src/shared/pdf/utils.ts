import { BaseItem } from "@/features/billing/models/invoiceItem";
import { PdfDocumentType, PdfLineItem, PdfTotals } from "./types";

export function formatPdfDate(value?: Date | string | null): string {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatPdfDateTime(value?: Date | string | null): string {
  const date = value ? (value instanceof Date ? value : new Date(value)) : new Date();
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

type FormatMoneyOptions = {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  fallbackCurrency?: string;
  showCurrency?: boolean;
};

export function formatNumber(
  value?: number | null,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
): string {
  const safeValue =
    typeof value === "number" && Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits,
    maximumFractionDigits,
  })
    .format(safeValue)
    .replace(/\u202F/g, " ")
    .replace(/\u00A0/g, " ");
}

export function formatMoney(
  value?: number | null,
  currency = "TND",
  options: FormatMoneyOptions = {}
): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    fallbackCurrency = "TND",
    showCurrency = true,
  } = options;

  const safeValue =
    typeof value === "number" && Number.isFinite(value) ? value : 0;

  const safeCurrency =
    typeof currency === "string" && currency.trim().length === 3
      ? currency.trim().toUpperCase()
      : fallbackCurrency;

  try {
    if (!showCurrency) {
      return formatNumber(
        safeValue,
        minimumFractionDigits,
        maximumFractionDigits
      );
    }

    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: safeCurrency,
      minimumFractionDigits,
      maximumFractionDigits,
    })
      .format(safeValue)
      .replace(/\u202F/g, " ")
      .replace(/\u00A0/g, " ");
  } catch {
    return `${formatNumber(
      safeValue,
      minimumFractionDigits,
      maximumFractionDigits
    )} ${fallbackCurrency}`;
  }
}

export function calculateLineHT(item: BaseItem): number {
  const gross = item.quantity * item.unityPriceEXclTax;
  return gross ;
}

export function calculateLineTax(item: BaseItem): number {
  return calculateLineHT(item) * ((item.vatRate || 0) / 100);
}

export function calculatePdfTotals(items: BaseItem[]): PdfTotals {
  return items.reduce<PdfTotals>(
    (acc, item) => {
      const gross = item.quantity * item.unityPriceEXclTax;
      const lineHT = calculateLineHT(item);
      const discount = gross - lineHT;
      const tax = calculateLineTax(item);

      acc.subtotalHT += lineHT;
      acc.discountTotal += discount;
      acc.taxTotal += tax;
      acc.totalTTC += lineHT + tax;

      return acc;
    },
    {
      subtotalHT: 0,
      discountTotal: 0,
      taxTotal: 0,
      totalTTC: 0,
    }
  );
}

export function getDocumentTitle(type: PdfDocumentType): string {
  switch (type) {
    case "INVOICE":
      return "VENTE";
    case "CREDIT_NOTE":
      return "AVOIR";
    case "PURCHASE_ORDER":
      return "COMMANDE";
    case "PAYMENT":
      return "Paiement";
  }
}

export function getDocumentNumberPrefix(type: PdfDocumentType): string {
  return "N°";
}

export function getBuyerLabel(type: PdfDocumentType): string {
  switch (type) {
    case "PURCHASE_ORDER":
      return "FOURNISSEUR";
    default:
      return "DESTINATAIRE";
  }
}

export function getMainTotalLabel(type: PdfDocumentType): string {
  switch (type) {
    case "INVOICE":
      return "Total TTC";
    case "CREDIT_NOTE":
      return "Total crédité";
    case "PURCHASE_ORDER":
      return "Total";
    case "PAYMENT":
      return "Total Payé";
  }
}

export function getAccentColor(type: PdfDocumentType, accentColor?: string): string {
  if (accentColor) return accentColor;

  switch (type) {
    case "INVOICE":
      return "#2563EB";
    case "CREDIT_NOTE":
      return "#DC2626";
    case "PURCHASE_ORDER":
      return "#059669";
    case "PAYMENT":
      return "#059669";
  }
}

export function getDocumentSoftColor(type: PdfDocumentType): string {
  switch (type) {
    case "INVOICE":
      return "#EFF6FF";
    case "CREDIT_NOTE":
      return "#FEF2F2";
    case "PURCHASE_ORDER":
      return "#ECFDF5";
    case "PAYMENT":
      return "#ECFDF5";
  }
}

export function getPaymentLabel(value?: string | null): string {
  if (!value) return "-";

  const labels: Record<string, string> = {
    BANK_TRANSFER: "Virement",
    CASH: "Espèces",
    CHECK: "Chèque",
    CARD: "Carte bancaire",
    NET_15: "Net 15 jours",
    NET_30: "Net 30 jours",
    NET_45: "Net 45 jours",
    NET_60: "Net 60 jours",
  };

  return labels[value] || value;
}
