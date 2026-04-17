import { InvoiceItem } from '../models/invoiceItem'
import { OperationCategoryLabels, operationCategorySchema } from '../types/operationCategory'
import { tvaRateSchema } from '../types/tvaRate'
import { v4 as uuidv4 } from "uuid";
export default function defaultItem(id?: string): InvoiceItem {
  return {
    idInvoiceItem: id ?? uuidv4() ,
    description: "",
    quantity: 0,
    unityPriceEXclTax: 0,
    vatRate: 0,
    itemTotalExclTax: 0,
    itemTaxAmount: 0,
    itemTotalInclTax: 0,
    operationCategory: operationCategorySchema.enum.SERVICE_PROVISION,
    invoice:null,
  }
}


export const mockInvoiceItems: InvoiceItem[] = [
  {
    idInvoiceItem: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Conseil RH - T1 2025',
    quantity: 40,
    unityPriceEXclTax: 250,
    vatRate: 0,
    itemTotalExclTax: 10000,
    itemTaxAmount: 1900,
    itemTotalInclTax: 11900,
    operationCategory: operationCategorySchema.enum.SERVICE_PROVISION,
    invoice: null
  },
  {
    idInvoiceItem: '323e4567-e89b-12d3-a456-426614174002',
    description: 'Développement Programme de Formation',
    quantity: 10,
    unityPriceEXclTax: 400,
    vatRate: 0,
    itemTotalExclTax: 4000,
    itemTaxAmount: 760,
    itemTotalInclTax: 4760,
    operationCategory: operationCategorySchema.enum.SERVICE_PROVISION,
    invoice: null
  },

  {
    idInvoiceItem: '423e4567-e89b-12d3-a456-426614174003',
    description: 'Audit Système d\'Information',
    quantity: 5,
    unityPriceEXclTax: 800,
    vatRate: 0,
    itemTotalExclTax: 4000,
    itemTaxAmount: 760,
    itemTotalInclTax: 4760,
    operationCategory: operationCategorySchema.enum.SERVICE_PROVISION,
    invoice: null
  },
  {
    idInvoiceItem: '523e4567-e89b-12d3-a456-426614174004',
    description: 'Licence Logiciel Annuelle',
    quantity: 3,
    unityPriceEXclTax: 600,
    vatRate: 19,
    itemTotalExclTax: 1800,
    itemTaxAmount: 126,
    itemTotalInclTax: 1926,
    operationCategory: operationCategorySchema.enum.SERVICE_PROVISION,
    invoice: null
  },
]