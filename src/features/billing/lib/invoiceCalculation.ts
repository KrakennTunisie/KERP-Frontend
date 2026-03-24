import { InvoiceItem } from "../models/invoiceItem"
import { CurrencyType } from "../types/currency";

export function defaultItem(): InvoiceItem {
  return {
    idInvoiceItem: crypto.randomUUID(),
    description: "produit",
    quantity: 1,
    unityPriceEXclTax: 100,
    vatRate: 19,
    itemTotalExclTax: 100,
    itemTaxAmount: 19,
    itemTotalInclTax: 119,
    operationCategory: "SERVICES",
  }
}


export function recalculate(
  item: InvoiceItem,
  currency: CurrencyType,
  exchangeRate: number
): InvoiceItem {

  // 1. Calcul dans la devise saisie
  const totalExclTax = item.quantity * item.unityPriceEXclTax;
  const taxAmount = totalExclTax * (item.vatRate / 100);
  const totalInclTax = totalExclTax + taxAmount;

  // 2. Conversion selon devise cible
  let convertedExclTax = totalExclTax;
  let convertedTax = taxAmount;
  let convertedInclTax = totalInclTax;

  if (currency === "EUR") {
    
    convertedExclTax = totalExclTax / exchangeRate;
    convertedTax = taxAmount / exchangeRate;
    convertedInclTax = totalInclTax / exchangeRate;
  } else {
    convertedExclTax = totalExclTax * exchangeRate;
    convertedTax = taxAmount * exchangeRate;
    convertedInclTax = totalInclTax * exchangeRate;
  }

  return {
    ...item,
    itemTotalExclTax: convertedExclTax,
    itemTaxAmount: convertedTax,
    itemTotalInclTax: convertedInclTax,
  };
}

export function convertItemCurrency(
  item: InvoiceItem,
  fromCurrency: CurrencyType,
  toCurrency: CurrencyType,
  exchangeRate: number
): InvoiceItem {
  if (fromCurrency === toCurrency) {
    return recalculate(item, toCurrency, exchangeRate);
  }

  let convertedUnitPrice = item.unityPriceEXclTax;

  if (fromCurrency === "TND" && toCurrency === "EUR") {
    convertedUnitPrice = item.unityPriceEXclTax / exchangeRate;
  } else if (fromCurrency === "EUR" && toCurrency === "TND") {
    convertedUnitPrice = item.unityPriceEXclTax * exchangeRate;
  }

  return recalculate(
    {
      ...item,
      unityPriceEXclTax: Number(convertedUnitPrice.toFixed(3)),
    },
    toCurrency,
    exchangeRate
  );
}