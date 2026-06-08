"use client";

import { FileText } from "lucide-react";

import Card from "./card";
import { SectionLabel } from "./sectionLabel";

type InvoiceDocumentsCardProps = {
  invoice: any;
  setPreviewDocument: (document: any) => void;
};

export function InvoiceDocumentsCard({
  invoice,
  setPreviewDocument,
}: InvoiceDocumentsCardProps) {
  const document = invoice?.invoiceDocument ?? invoice?.paymentDocument;

  return (
    <Card>
      <SectionLabel>Documents attachés</SectionLabel>

      {document ? (
        <button
          type="button"
          onClick={() => setPreviewDocument(document)}
          className="group mt-4 flex w-full items-center justify-between rounded-xl bg-slate-50 p-3 text-left transition-colors hover:bg-slate-100"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50">
              <FileText className="h-5 w-5 text-rose-600" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {document.fileName ?? "Document facture"}
              </p>

              <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                Document PDF · Facture
              </p>
            </div>
          </div>

          <svg
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="shrink-0 text-slate-400 transition-colors group-hover:text-slate-700"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
          <FileText className="mx-auto h-7 w-7 text-slate-300" />

          <p className="mt-2 text-sm font-bold text-slate-500">
            Aucun document attaché
          </p>

          <p className="mt-1 text-xs font-medium text-slate-400">
            Aucun fichier n’est associé à cette facture.
          </p>
        </div>
      )}
    </Card>
  );
}