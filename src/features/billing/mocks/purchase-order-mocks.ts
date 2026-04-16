import { PurchaseOrder } from "../models/purchaseOrder";
import { MOCK_PARTNERS } from "./clients-mocks";
import { mockInvoiceItems } from "./invoice-items-mocks";

export const mockPurchaseOrder: PurchaseOrder = {
  idPurchaseOrder: "PO-2024-001",
  purchaseOrderNumber: "BC-2024-0042",
  issueDate: new Date("2024-06-15"),
  creationDate: new Date("2024-03-01"),
  Status: "EN COURS DE LIVRAISON",
  currency: "EUR",
  totalExclTax: 15000.00,
  totalInclTax: 18150.00,
  vatAmount: 3150.00,
  paymentMethod: "BANK_TRANSFER",
  exchangeRateReferenceDate: new Date("2024-03-01"),
  appliedExchangeRate: 1.0,
  exchangeRateSource: "EXTERNAL_API",
  PaymentCondition: "NET_30",
  partner: MOCK_PARTNERS[0],
  purchaseOrderItems: mockInvoiceItems,
  purchaseOrderDocument: null
};

// Plusieurs mocks pour les tests
export const mockPurchaseOrders: PurchaseOrder[] = [
  mockPurchaseOrder,
  {
    idPurchaseOrder: "PO-2024-002",
    purchaseOrderNumber: "BC-2024-0043",
    issueDate: new Date("2024-07-01"),
    creationDate: new Date("2024-03-10"),
    Status: "BROULLION",
    currency: "TND",
    totalExclTax: 8000.00,
    totalInclTax: 9520.00,
    vatAmount: 1520.00,
    paymentMethod: "BANK_TRANSFER",
    exchangeRateReferenceDate: new Date("2024-03-10"),
    appliedExchangeRate: 3.35,
    exchangeRateSource: "EXTERNAL_API",
    PaymentCondition: "NET_15",
    partner: null,
    purchaseOrderItems: null,
    purchaseOrderDocument: null
  },
  {
    idPurchaseOrder: "PO-2024-003",
    purchaseOrderNumber: "BC-2024-0044",
    issueDate: new Date("2024-05-20"),
    creationDate: null,
    Status: "CLOTURÉ",
    currency: "DOLLAR",
    totalExclTax: 25000.00,
    totalInclTax: 29750.00,
    vatAmount: 4750.00,
    paymentMethod: "BANK_TRANSFER",
    exchangeRateReferenceDate: new Date("2024-03-15"),
    appliedExchangeRate: 3.12,
    exchangeRateSource: "EXTERNAL_API",
    PaymentCondition: "IMMEDIATE",
    partner: null,
    purchaseOrderItems: [],
    purchaseOrderDocument: null
  },
];