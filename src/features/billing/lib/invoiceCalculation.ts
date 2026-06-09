import { BaseItem,  PurchaseOrderItem } from "../models/invoiceItem"
import { CurrencyType } from "../types/currency";


function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

// calcul de HT et TVA Et TTC d'un item 
export function recalculate(
  item: BaseItem,
): BaseItem {

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
  item: BaseItem,
  fromCurrency: CurrencyType,
  toCurrency: CurrencyType
): BaseItem {
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
export function calculateInvoiceTotals(items: BaseItem[] = []) {
  const totalHT = items.reduce(
    (acc, item) => acc + (item.quantity * item.unityPriceEXclTax) ,
    0
  );

  const totalTVA = items.reduce(
    (acc, item) => acc + ((item.quantity * item.unityPriceEXclTax)*(item.vatRate/100)),
    0
  );

  const totalTTC = items.reduce(
    (acc, item) => acc + ((item.quantity * item.unityPriceEXclTax)*(1 + item.vatRate/100)),
    0
  );

  return {
    totalHT,
    totalTVA,
    totalTTC,
  };
}

export function calculateInvoiceTotalsFromPurchaseOrder(items: PurchaseOrderItem[] = []) {
  const totalHT = items.reduce(
    (acc, item) => acc + ((item.quantity - item.invoicedQuantity) * item.unityPriceEXclTax) ,
    0
  );

  const totalTVA = items.reduce(
    (acc, item) => acc + (((item.quantity - item.invoicedQuantity)  * item.unityPriceEXclTax)*(item.vatRate/100)),
    0
  );

  const totalTTC = items.reduce(
    (acc, item) => acc + (((item.quantity - item.invoicedQuantity) * item.unityPriceEXclTax)*(1 + item.vatRate/100)),
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
  item: BaseItem,
  currency: CurrencyType,
  exchangeRate: number
): BaseItem {
  return {
    ...item,
    unityPriceEXclTax: currency === "TND"
      ? round2(item.unityPriceEXclTax)  // TND → EUR
      : round2(item.unityPriceEXclTax ), // EUR → TND
  };
}