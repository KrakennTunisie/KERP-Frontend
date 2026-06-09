"use client";

import { Document } from "@/features/billing/models/document";
import getDocumentMeta from "@/shared/utils/getDocumentMeta";
import { Eye, Paperclip } from "lucide-react";

type DocumentItemProps = {
  label: string;
  document: Document | File | null;
  onOpen: (document: Document | File) => void;
};

export default function DocumentItem({
  label,
  document,
  onOpen,
}: DocumentItemProps) {
  if (!document) {
    return (
      <div>
        <p className="mb-1.5 text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">
          {label}
        </p>

        <div className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-dashed border-gray-200 bg-gray-50">
          <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
            <Paperclip className="w-4 h-4 text-gray-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-500">
              Aucun document
            </p>
            <p className="text-[11px] font-medium text-gray-400">
              Pièce non fournie
            </p>
          </div>
        </div>
      </div>
    );
  }

  const meta = document instanceof File ? null : getDocumentMeta(document);
  const Icon = meta?.icon as React.ElementType | undefined;

  return (
    <div>
      <p className="mb-1.5 text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">
        {label}
      </p>

      <button
        type="button"
        onClick={() => onOpen(document)}
        className="group w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-left shadow-sm cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
          {Icon && <Icon className={`w-4 h-4 ${meta?.iconClass}`} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">
              {document instanceof File ? document.name : document.fileName}
            </p>

            {meta && (
              <span
                className={`shrink-0 inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${meta.badgeClass}`}
              >
                {meta.label}
              </span>
            )}
          </div>

          <p className="text-[10px] font-medium text-gray-500 mt-0.5">
            Cliquer pour prévisualiser
          </p>
        </div>

        <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 group-hover:text-gray-900 group-hover:bg-gray-100 transition-colors shrink-0">
          <Eye className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
}