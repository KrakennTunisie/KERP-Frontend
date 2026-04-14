"use client";

import { z } from "zod";
import { useEffect, useRef } from "react";
import getDocumentType from "@/shared/utils/getDocumentType";
import { Modal } from "./modal";
import { FileText, Download, ExternalLink, File as FileIcon } from "lucide-react";
import { Document as BillingDocument } from "@/features/billing/models/document";
import { FileSchema } from "../../../features/billing/types/pdfSchema";
import { useCreateInvoice } from "@/features/billing/hooks/useCreateEditInvoice";


type DocumentOrFile = BillingDocument| FileSchema | null;

const isFile = (doc: DocumentOrFile): doc is File => doc instanceof File;

type DocumentPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  document: DocumentOrFile;
  onCreateInvoice?: () => void;
};

export function DocumentPreviewModal({
  open,
  onClose,
  document,
  onCreateInvoice
}: DocumentPreviewModalProps) {
  const objectUrlRef = useRef<string | null>(null);

  const { url, fileName } = (() => {
    if (!document) return { url: null, fileName: null };
    if (isFile(document)) {
      const objectUrl = URL.createObjectURL(document);
      objectUrlRef.current = objectUrl;
      return { url: objectUrl, fileName: document.name };
    }
    return { url: document.storageURL, fileName: document.fileName };
  })();

  const documentType = getDocumentType(document);

  

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [document]);

  const handleClose = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    onClose();
  };

  const footer = (
    <>
      
       <a href={url ?? undefined}
        target="_blank"
        rel="noreferrer"
        className="px-5 py-3 rounded-2xl border border-gray-200 font-black text-black hover:bg-gray-50 inline-flex items-center gap-2"
      >
        <ExternalLink className="w-4 h-4" />
        Ouvrir
      </a>

     {isFile(document)  && onCreateInvoice ? (
      <button
        onClick={() => {
         onCreateInvoice()
        }}
        className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue inline-flex items-center gap-2"
      >
        Créer la facture
      </button>
    ) : (
      <a
        href={url ?? undefined}
        download={fileName ?? true}
        className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue inline-flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Télécharger
      </a>
    )}
    </>
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={"Prévisualisation du facture : "+ fileName  }
      footer={footer}
    >
      <div className="w-full">
        {documentType === "image" && (
          <div className="rounded-3xl overflow-hidden border border-gray-100 bg-gray-50">
            <img
              src={url ?? undefined}
              alt={fileName ?? "Document image"}
              className="w-full max-h-[70vh] object-contain bg-white"
            />
          </div>
        )}

        {documentType === "pdf" && (
          <div className="rounded-3xl overflow-hidden border border-gray-100 bg-gray-50">
            <iframe
              src={url ?? undefined}
              title={fileName ?? "Prévisualisation PDF"}
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
              <FileIcon className="w-8 h-8 text-gray-600" />
            </div>

            <p className="text-lg font-black text-gray-900">
              Prévisualisation indisponible
            </p>
            <p className="text-sm font-bold text-gray-600 mt-2 max-w-md">
              Ce type de document ne peut pas être affiché directement. Vous
              pouvez l'ouvrir dans un nouvel onglet ou le télécharger.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}