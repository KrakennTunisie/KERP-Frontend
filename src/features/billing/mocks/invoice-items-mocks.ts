import { v4 as uuidv4 } from "uuid";
import { InvoiceItem } from '../models/invoiceItem';
import { operationCategorySchema } from '../types/operationCategory';
export default function defaultItem(id?: string): InvoiceItem {
  return {
  idInvoiceItem: id ?? uuidv4(),
  purchaseOrderItem: null,
  description: "",
  quantity: 0,
  unityPriceEXclTax: 0,
  vatRate: 0,
  itemTotalExclTax: 0,
  itemTaxAmount: 0,
  itemTotalInclTax: 0,
  operationCategory: operationCategorySchema.enum.SERVICE_PROVISION,
  invoice: null,
  creditedQuantity: 0,
  discountType: null,
  discountValue: null,
}
}
