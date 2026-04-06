import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import { fileSchema } from "../types/pdfSchema";

export const handleSaveAsPDF = async (
  invoiceRef: React.RefObject<HTMLDivElement | null>,
  invoiceNumber: string
): Promise<File | null> => {
  if (!invoiceRef.current) return null;

  const element = invoiceRef.current;

  try {
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;

    element.style.height = "auto";
    element.style.overflow = "visible";

    const imgData = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a3",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    const img = new Image();
    img.src = imgData;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Impossible de charger l'image générée"));
    });

    const widthRatio = maxWidth / img.width;
    const heightRatio = maxHeight / img.height;
    const ratio = Math.min(widthRatio, heightRatio);

    const renderWidth = img.width * ratio;
    const renderHeight = img.height * ratio;

    const x = (pageWidth - renderWidth) / 2;
    const y = margin;

    pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);

    const pdfBlob = pdf.output("blob");
    const fileName = `${invoiceNumber}.pdf`;
    const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });

    return pdfFile;
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
    return null;
  }
};
// Permet la génération de la facture une fois remplie 
  /*const handlePrint = useReactToPrint({
  contentRef: invoiceRef,
  documentTitle: `invoice-${getValues("invoiceNumber") ?? "draft"}`,
});*/