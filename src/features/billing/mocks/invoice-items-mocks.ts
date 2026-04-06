import { InvoiceItem } from '../models/invoiceItem'
import { OperationCategoryLabels, operationCategorySchema } from '../types/operationCategory'

export default function defaultItem(): InvoiceItem {
  return {
    idInvoiceItem: crypto.randomUUID(),
    description: "",
    quantity: 0,
    unityPriceEXclTax: 0,
    vatRate: 0,
    itemTotalExclTax: 0,
    itemTaxAmount: 0,
    itemTotalInclTax: 0,
    operationCategory: operationCategorySchema.enum.SERVICE_PROVISION,
  }
}
export const mockInvoiceItem: InvoiceItem = {
  idInvoiceItem: '123e4567-e89b-12d3-a456-426614174000',
  description: 'Conseil RH - T1 2025',
  quantity: 40,
  unityPriceEXclTax: 250,
  vatRate: 0.19,
  itemTotalExclTax: 10000,
  itemTaxAmount: 1900,
  itemTotalInclTax: 11900,
  operationCategory: operationCategorySchema.enum.SERVICE_PROVISION
}

export const mockInvoiceItems: InvoiceItem[] = [
  {
    idInvoiceItem: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Conseil RH - T1 2025',
    quantity: 40,
    unityPriceEXclTax: 250,
    vatRate: 0.19,
    itemTotalExclTax: 10000,
    itemTaxAmount: 1900,
    itemTotalInclTax: 11900,
    operationCategory: 'SERVICES'
  },
  {
    idInvoiceItem: '223e4567-e89b-12d3-a456-426614174001',
    description: 'Abonnement Plateforme Recrutement',
    quantity: 1,
    unityPriceEXclTax: 1500,
    vatRate: 0.19,
    itemTotalExclTax: 1500,
    itemTaxAmount: 285,
    itemTotalInclTax: 1785,
    operationCategory: 'SERVICES'
  },
  {
    idInvoiceItem: '323e4567-e89b-12d3-a456-426614174002',
    description: 'Développement Programme de Formation',
    quantity: 10,
    unityPriceEXclTax: 400,
    vatRate: 0.19,
    itemTotalExclTax: 4000,
    itemTaxAmount: 760,
    itemTotalInclTax: 4760,
    operationCategory: 'SERVICES'
    },
  ,
  {
    idInvoiceItem: '423e4567-e89b-12d3-a456-426614174003',
    description: 'Audit Système d\'Information',
    quantity: 5,
    unityPriceEXclTax: 800,
    vatRate: 0.19,
    itemTotalExclTax: 4000,
    itemTaxAmount: 760,
    itemTotalInclTax: 4760,
    operationCategory: 'SERVICES'
  },
  {
    idInvoiceItem: '523e4567-e89b-12d3-a456-426614174004',
    description: 'Licence Logiciel Annuelle',
    quantity: 3,
    unityPriceEXclTax: 600,
    vatRate: 0.07,
    itemTotalExclTax: 1800,
    itemTaxAmount: 126,
    itemTotalInclTax: 1926,
    operationCategory: 'SERVICES'
  },
].filter((item): item is InvoiceItem => item !== undefined)