import { Document as BillingDocument } from "@/features/billing/models/document";
import { FileSchema } from "@/features/billing/types/pdfSchema";

type DocumentOrFile = BillingDocument | FileSchema | null | undefined;

const getDocumentType = (document: DocumentOrFile): "pdf" | "image" | "word" | "unknown" => {
  if (!document) return "unknown";

  // ✅ Récupère le mimeType selon le type
  const mimeType = document instanceof File ? document.type : document.mimeType;

  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) return "word";

  return "unknown";
};

export default getDocumentType;