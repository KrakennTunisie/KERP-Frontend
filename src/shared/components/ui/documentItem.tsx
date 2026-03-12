"use client";

import { Document } from "@/features/billing/models/document";
import getDocumentMeta from "@/shared/utils/getDocumentMeta";
import { Eye, FileImage, FileText, Paperclip } from "lucide-react";

type DocumentItemProps = {
  label: string;
  document?: Document | undefined;
  onOpen: (document: Document) => void;
};


export default function DocumentItem({
  label,
  document,
  onOpen,
}: DocumentItemProps) {
  if (!document) {
    return (
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
          {label}
        </p>

        <div className="w-full flex items-center gap-3 p-4 rounded-3xl border border-dashed border-gray-200 bg-gray-50">
          <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
            <Paperclip className="w-5 h-5 text-gray-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-gray-500">Aucun document</p>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Pièce non fournie
            </p>
          </div>
        </div>
      </div>
    );
  }

  const meta = getDocumentMeta(document);
  const Icon = meta.icon;

  return (
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
        {label}
      </p>

      <button
        type="button"
        onClick={() => onOpen(document)}
        className="group w-full flex items-center gap-4 p-4 rounded-3xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-left shadow-sm cursor-pointer"
      >
        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
          <Icon className={`w-5 h-5 ${meta.iconClass}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-black text-gray-900 truncate">
              {document.fileName}
            </p>

            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${meta.badgeClass}`}
            >
              {meta.label}
            </span>
          </div>

          <p className="text-xs font-semibold text-gray-500 mt-1">
            Cliquer pour prévisualiser le document
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-gray-500 group-hover:text-gray-900 transition-colors shrink-0">
          <Eye className="w-4 h-4" />
          <span className="text-xs font-bold">Voir</span>
        </div>
      </button>
    </div>
  );
}