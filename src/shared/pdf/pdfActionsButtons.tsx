"use client";

import {  Eye } from "lucide-react";
import { PdfDocumentData } from "./types";
import { openPdfInNewTab } from "./pdfGenerator";

export function PdfActionButtons({ data }: { data: PdfDocumentData }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => openPdfInNewTab(data)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <Eye className="h-4 w-4" />
        Aperçu PDF
      </button>
    </div>
  );
}