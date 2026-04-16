import { InvoiceItem } from "../models/invoiceItem"
import { CurrencyType } from "../types/currency";


function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

// calcul de HT et TVA Et TTC d'un item 
export function recalculate(
  item: InvoiceItem,
): InvoiceItem {

  const totalExclTax = round2(item.quantity * item.unityPriceEXclTax);
  const taxAmount    = round2(totalExclTax * (item.vatRate / 100));
  const totalInclTax = round2(totalExclTax + taxAmount);

  return {
    ...item,
    unityPriceEXclTax: item.unityPriceEXclTax,
    itemTotalExclTax:  totalExclTax,
    itemTaxAmount:     taxAmount,
    itemTotalInclTax:  totalInclTax,
  };
}


// Conversion de la devise
export function convertItemCurrency(
  item: InvoiceItem,
  fromCurrency: CurrencyType,
  toCurrency: CurrencyType,
  exchangeRate: number
): InvoiceItem {
  if (fromCurrency === toCurrency) {
    return recalculate(item);
  }

  let convertedUnitPrice = item.unityPriceEXclTax;

  if (fromCurrency === "TND" && toCurrency === "EUR") {
    convertedUnitPrice = item.unityPriceEXclTax;
  } else if (fromCurrency === "EUR" && toCurrency === "TND") {
    convertedUnitPrice = item.unityPriceEXclTax ;
  }

 return recalculate({ ...item, unityPriceEXclTax: convertedUnitPrice });
}

// calcul les totaux TTC HT de tous les items
export function calculateInvoiceTotals(items: InvoiceItem[] = []) {
  const totalHT = items.reduce(
    (acc, item) => acc + (item.itemTotalExclTax ?? 0),
    0
  );

  const totalTVA = items.reduce(
    (acc, item) => acc + (item.itemTaxAmount ?? 0),
    0
  );

  const totalTTC = items.reduce(
    (acc, item) => acc + (item.itemTotalInclTax ?? 0),
    0
  );

  return {
    totalHT,
    totalTVA,
    totalTTC,
  };
}
// calcule le prix unitaire d'un item
export function calculUnityPrice(
  item: InvoiceItem,
  currency: CurrencyType,
  exchangeRate: number
): InvoiceItem {
  return {
    ...item,
    unityPriceEXclTax: currency === "TND"
      ? round2(item.unityPriceEXclTax)  // TND → EUR
      : round2(item.unityPriceEXclTax ), // EUR → TND
  };
}