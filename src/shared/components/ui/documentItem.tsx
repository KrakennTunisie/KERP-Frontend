"use client";

import { useMemo, useState } from "react";
import { Document } from "@/features/billing/models/document";
import getDocumentMeta from "@/shared/utils/getDocumentMeta";
import {
  Eye,
  Paperclip,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type DocumentsListProps = {
  label: string;
  documents: (Document | File  )[];
  onOpen: (document: Document | File) => void;
};

export default function DocumentsList({
  label,
  documents,
  onOpen,
}: DocumentsListProps) {
  const [page, setPage] = useState(1);

  const pageSize = 2;

  const totalPages = Math.max(
    1,
    Math.ceil(documents.length / pageSize)
  );

  const paginatedDocuments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return documents.slice(start, start + pageSize);
  }, [documents, page]);

  return (
    <div>
      <div className="mt-4 flex items-center justify-between mb-1.5">
        <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">
          {label+"("+documents.length+")"}
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="w-full flex items-center gap-2 p-2 rounded-xl border border-dashed border-gray-200 bg-gray-50">
          <div className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center shrink-0">
            <Paperclip className="w-3.5 h-3.5 text-gray-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-gray-500">
              Aucun document
            </p>

            <p className="text-[10px] font-medium text-gray-400">
              Pièce non fournie
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`grid gap-2 ${
              paginatedDocuments.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {paginatedDocuments.map((document, index) => {
              const meta =
                document instanceof File
                  ? null
                  : getDocumentMeta(document);

              const Icon =
                meta?.icon as React.ElementType | undefined;

              return (
                <button
                  key={
                    document instanceof File
                      ? `${document.name}-${index}`
                      : document.idDocument
                  }
                  type="button"
                  onClick={() => onOpen(document)}
                  className="
                    group
                    w-full
                    flex items-center gap-2
                    p-2
                    rounded-xl
                    border border-gray-200
                    bg-white
                    hover:bg-gray-50
                    hover:border-gray-300
                    transition-all
                    text-left
                    shadow-sm
                    cursor-pointer
                  "
                >
                  <div className="w-7 h-7 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                    {Icon && (
                      <Icon
                        className={`w-3.5 h-3.5 ${meta?.iconClass}`}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 min-w-0">
                      <p className="text-[11px] font-bold text-gray-900 truncate">
                        {document instanceof File
                          ? document.name
                          : document.fileName}
                      </p>

                      {meta && (
                        <span
                          className={`shrink-0 inline-flex items-center rounded-full border px-1 py-0.5 text-[8px] font-bold ${meta.badgeClass}`}
                        >
                          {meta.label}
                        </span>
                      )}
                    </div>

                    <p className="text-[9px] font-medium text-gray-500 mt-0.5">
                      Prévisualiser
                    </p>
                  </div>

                  <div className="flex items-center justify-center w-6 h-6 rounded-md text-gray-400 group-hover:text-gray-900 group-hover:bg-gray-100 transition-colors shrink-0">
                    <Eye className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-1 mt-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="
                  w-6 h-6
                  rounded-md
                  border border-gray-200
                  flex items-center justify-center
                  disabled:opacity-40
                  cursor-pointer
                "
              >
                <ChevronLeft className="w-3 h-3" />
              </button>

              <span className="text-[10px] font-bold text-gray-500">
                {page}/{totalPages}
              </span>

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="
                  w-6 h-6
                  rounded-md
                  border border-gray-200
                  flex items-center justify-center
                  disabled:opacity-40
                  cursor-pointer
                "
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}