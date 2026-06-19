"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  ImageIcon,
  Upload,
  Paperclip,
  X,
} from "lucide-react";
import { Modal } from "./modal";
import { PartnerDocumentType } from "@/features/billing/types/documentType";

type AddDocumentModalProps = {
  open: boolean;
  type: PartnerDocumentType,
  loading: boolean,
  onClose: () => void;
  onAdd: (file: File, type:PartnerDocumentType) => Promise<void>;
};

export default function AddDocumentModal({
  open,
  type,
  loading,
  onClose,
  onAdd,
}: AddDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => {
    if (!file) {
      setPreviewUrl(undefined);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const reset = () => {
    setFile(null);
    setPreviewUrl(undefined);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAdd = async () => {
    if (!file) return;

    await onAdd(file, type);
    handleClose();
  };

  const isImage = file?.type.startsWith("image/");
  const isPdf = file?.type === "application/pdf";

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Ajouter un document: ${type}`}
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="
              px-4 py-2 rounded-lg
              border border-gray-200
              text-sm font-medium
              hover:bg-gray-50
              disabled:opacity-50
              disabled:cursor-not-allowed
              cursor-pointer
            "
          >
            Annuler
          </button>

          <button
            type="button"
            disabled={!file || loading}
            onClick={handleAdd}
            className="
              px-4 py-2 rounded-lg
              bg-blue-600 text-white
              text-sm font-semibold
              hover:bg-blue-700
              disabled:opacity-50
              disabled:cursor-not-allowed
              cursor-pointer
            "
          >
            {loading ?"Chargement ..." :"Ajouter"}
          </button>
        </>
      }
    >
      {!file ? (
        <label
          className="
            flex flex-col items-center justify-center
            w-full h-52
            border-2 border-dashed border-gray-200
            rounded-xl
            bg-gray-50
            hover:bg-gray-100
            cursor-pointer
            transition-colors
          "
        >
          <Upload className="w-10 h-10 text-gray-400 mb-3" />

          <p className="text-sm font-semibold text-gray-700">
            Cliquez pour sélectionner un document
          </p>

          <p className="text-xs text-gray-500 mt-1">
            PDF, PNG, JPG, JPEG...
          </p>

          <input
            type="file"
            className="hidden"
            onChange={(e) =>
              setFile(e.target.files?.[0] ?? null)
            }
          />
        </label>
      ) : (
        <div className="space-y-4">
          {/* Infos fichier */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              {isImage ? (
                <ImageIcon className="w-5 h-5 text-blue-500" />
              ) : (
                <FileText className="w-5 h-5 text-red-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {file.name}
              </p>

              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>

            <button
              type="button"
              onClick={reset}
              className="
                w-8 h-8
                rounded-lg
                hover:bg-gray-200
                flex items-center justify-center
                cursor-pointer
              "
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Prévisualisation */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {isImage && previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="w-full max-h-[400px] object-contain"
              />
            )}

            {isPdf && previewUrl && (
              <iframe
                src={previewUrl}
                title="PDF Preview"
                className="w-full h-[450px]"
              />
            )}

            {!isImage && !isPdf && (
              <div className="flex flex-col items-center justify-center py-12">
                <Paperclip className="w-10 h-10 text-gray-400 mb-2" />

                <p className="text-sm font-semibold text-gray-700">
                  Prévisualisation indisponible
                </p>

                <p className="text-xs text-gray-500">
                  Le document sera ajouté tel quel.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}