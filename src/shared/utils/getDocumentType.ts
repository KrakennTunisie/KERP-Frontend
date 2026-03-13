import { Document } from "@/features/billing/models/document";

type DocumentType = "image" | "pdf" | "word" | "unknown";


export default function getDocumentType(document : Document | null): DocumentType {
  if (!document) return "unknown";

  const url = document.storageURL.toLowerCase();
  const mime = document.mimeType.toLowerCase() ?? "";

  if (
    mime.startsWith("image/") ||
    /\.(png|jpg|jpeg|webp|gif|bmp|svg)$/.test(url)
  ) {
    return "image";
  }

  if (mime === "application/pdf" || url.endsWith(".pdf")) {
    return "pdf";
  }

  if (
    mime.includes("word") ||
    mime.includes("officedocument.wordprocessingml.document") ||
    url.endsWith(".doc") ||
    url.endsWith(".docx")
  ) {
    return "word";
  }

  return "unknown";
}