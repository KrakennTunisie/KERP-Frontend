import { FileImage, FileText, Paperclip } from "lucide-react";
import getDocumentType from "./getDocumentType";
import { Document } from "@/features/billing/models/document";

export default function getDocumentMeta(document: Document) {
  const documentType = getDocumentType(document);

  switch (documentType) {
    case "image":
      return {
        label: "Image",
        icon: FileImage,
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        iconClass: "text-emerald-600",
      };

    case "pdf":
      return {
        label: "PDF",
        icon: FileText,
        badgeClass: "bg-red-50 text-red-700 border-red-200",
        iconClass: "text-red-600",
      };

    case "word":
      return {
        label: "Word",
        icon: FileText,
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
        iconClass: "text-blue-600",
      };

    default:
      return {
        label: "Fichier",
        icon: Paperclip,
        badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
        iconClass: "text-gray-600",
      };
  }
}