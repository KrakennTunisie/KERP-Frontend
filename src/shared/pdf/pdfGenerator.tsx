import { pdf } from "@react-pdf/renderer";
import { PdfDocumentData } from "./types";
import { ProfessionalDocumentPdf } from "./professionalPDF";
export async function generatePdfBlob(data: PdfDocumentData): Promise<Blob> {
  return(pdf(<ProfessionalDocumentPdf data={data} />).toBlob());
}


export async function openPdfInNewTab(data: PdfDocumentData): Promise<void> {
  const blob = await generatePdfBlob(data);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function generatePdfFile(
  data: PdfDocumentData,
  fileName?: string
): Promise<File | null> {
  try {
    const blob = await generatePdfBlob(data);

    const safeFileName =
      fileName ||
      `${data.type.toLowerCase().replace("_", "-")}-${data.number}.pdf`;

    return new File([blob], safeFileName, {
      type: "application/pdf",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Failed to generate PDF file:", error);
    return null;
  }
}
