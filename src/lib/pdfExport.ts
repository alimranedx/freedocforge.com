/**
 * FreeDocForge 1-Click Vector/Raster PDF & Image Export Engine
 * Generates crisp, client-side, zero-watermark documents directly to device downloads.
 */

export interface ExportPdfOptions {
  element: HTMLElement;
  filename: string;
  paperSize?: "A4" | "POS_80MM";
  scale?: number;
}

export async function exportElementToPdf({
  element,
  filename,
  paperSize = "A4",
  scale = 2,
}: ExportPdfOptions): Promise<void> {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");
  const isPos = paperSize === "POS_80MM";
  const cleanFilename = filename.toLowerCase().endsWith(".pdf") ? filename : `${filename}.pdf`;

  if (isPos) {
    // 80mm thermal receipt roll dimensions
    const mmWidth = 80;
    const mmHeight = Math.max(80, (canvas.height * mmWidth) / canvas.width);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [mmWidth, mmHeight],
    });
    pdf.addImage(imgData, "PNG", 0, 0, mmWidth, mmHeight);
    pdf.save(cleanFilename);
  } else {
    // Standard ISO A4 (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    } else {
      // Multi-page slicing for large document content
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }
    pdf.save(cleanFilename);
  }
}

export async function exportElementToJpg(
  element: HTMLElement,
  filename: string,
  scale = 2
): Promise<void> {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });
  const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
  const link = document.createElement("a");
  const cleanFilename = filename.toLowerCase().endsWith(".jpg") ? filename : `${filename}.jpg`;
  link.download = cleanFilename;
  link.href = dataUrl;
  link.click();
}
