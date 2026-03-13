"use client";

import getDocumentType from "@/shared/utils/getDocumentType";
import { Modal } from "./modal";
import {
  FileText,
  Download,
  ExternalLink,
  File,
} from "lucide-react";
import { Document } from "@/features/billing/models/document";


type DocumentPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  document: Document | null
};



export function DocumentPreviewModal({
  open,
  onClose,
  document
}: DocumentPreviewModalProps) {
  const documentType = getDocumentType(document);

  const footer = (
    <>
      <a
        href={document?.storageURL}
        target="_blank"
        rel="noreferrer"
        className="px-5 py-3 rounded-2xl border border-gray-200 font-black hover:bg-gray-50 inline-flex items-center gap-2"
      >
        <ExternalLink className="w-4 h-4" />
        Ouvrir
      </a>

      <a
        href={document?.storageURL}
        download
        className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-black hover:bg-black inline-flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Télécharger
      </a>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={document?.fileName ?? "Prévisualisation du document"}
      footer={footer}
    >
      <div className="w-full">
        {documentType === "image" && (
          <div className="rounded-3xl overflow-hidden border border-gray-100 bg-gray-50">
            <img
              src={document?.storageURL}
              alt={document?.fileName ?? "Document image"}
              className="w-full max-h-[70vh] object-contain bg-white"
            />
          </div>
        )}

        {documentType === "pdf" && (
          <div className="rounded-3xl overflow-hidden border border-gray-100 bg-gray-50">
            <iframe
              src={document?.storageURL}
              title={document?.fileName ?? "Prévisualisation PDF"}
              className="w-full h-[70vh] bg-white"
            />
          </div>
        )}

        {documentType === "word" && (
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>

            <p className="text-lg font-black text-gray-900">
              Aperçu direct non disponible
            </p>
            <p className="text-sm font-bold text-gray-600 mt-2 max-w-md">
              Les fichiers Word ne peuvent pas être prévisualisés directement de
              manière fiable dans le navigateur. Vous pouvez ouvrir le document
              dans un nouvel onglet ou le télécharger.
            </p>

            <div className="mt-4 text-xs font-semibold text-gray-500">
              Formats supportés : .doc, .docx
            </div>
          </div>
        )}

        {documentType === "unknown" && (
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <File className="w-8 h-8 text-gray-600" />
            </div>

            <p className="text-lg font-black text-gray-900">
              Prévisualisation indisponible
            </p>
            <p className="text-sm font-bold text-gray-600 mt-2 max-w-md">
              Ce type de document ne peut pas être affiché directement. Vous
              pouvez l’ouvrir dans un nouvel onglet ou le télécharger.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}