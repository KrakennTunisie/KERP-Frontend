"use client";

import { creditNoteToPdfData, invoiceToPdfData, purchaseOrderToPdfData } from "@/shared/pdf/documentAdapter";
import { PdfActionButtons } from "@/shared/pdf/pdfActionsButtons";
import { mockCreditNote, mockInvoice, mockPurchaseOrder } from "@/shared/pdf/pdfMocks";


export default function PdfTestPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Facture client
        </h2>

        <PdfActionButtons data={invoiceToPdfData(mockInvoice)} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Facture d’avoir
        </h2>

        <PdfActionButtons data={creditNoteToPdfData(mockCreditNote)} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Bon de commande
        </h2>

        <PdfActionButtons data={purchaseOrderToPdfData(mockPurchaseOrder)} />
      </div>
    </div>
  );
}