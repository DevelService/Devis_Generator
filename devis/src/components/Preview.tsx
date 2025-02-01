"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as pdfjsLib from "pdfjs-dist/webpack";
import dmSansRegular from '@/fonts/DMSans-Regular';
import dmSansBold from '@/fonts/DMSans-Bold';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker.js';

interface Service {
  title: string;
  description: string;
  price: number;
  quantity: number;
}

interface PreviewProps {
  formData: {
    company: string;
    siret: string;
    address: string;
    email: string;
    phone: string;
    vat: string;
    quoteNumber: string;
    prestations: Service[];
    additionalInfo: string;
  };
}

export default function Preview({ formData }: PreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const canvasRefs = useRef<HTMLCanvasElement[]>([]);
  const currentRenderTask = useRef<any>(null);
  const timeoutRef = useRef<any>(null);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.addFileToVFS("DMSans-Regular.ttf", dmSansRegular);
    doc.addFont("DMSans-Regular.ttf", "DM Sans", "normal");
    doc.addFileToVFS("DMSans-Bold.ttf", dmSansBold);
    doc.addFont("DMSans-Bold.ttf", "DM Sans", "bold");

    doc.setFont("DM Sans");

    doc.setFontSize(24);
    doc.setTextColor("#4B3CE4");
    doc.text("Devis", 15, 20);
    doc.setTextColor("#374151");
    doc.setFontSize(20);
    doc.setFont("DM Sans", "bold");
    doc.text(`N° D-${new Date().getFullYear()}-${formData.quoteNumber}`, 15, 30);

    doc.setFont("DM Sans", "bold");
    doc.setFontSize(14);
    doc.text(`${(formData.company || "[Entreprise]").toUpperCase()}`, 15, 50);
    doc.setFont("DM Sans", "normal");
    doc.setFontSize(12);
    doc.text(`${(formData.address.split(', ')[0] || "[Adresse 1]").toUpperCase()}`, 15, 55);
    doc.text(`${(formData.address.split(', ')[1] || "[Adresse 2]").toUpperCase()}`, 15, 60);
    doc.text(`${formData.email || "[Email]"}`, 15, 65);
    doc.text(`${formData.phone || "[Téléphone]"}`, 15, 70);
    doc.text(`N° SIRET: ${formData.siret || "[SIRET/SIREN]"}`, 15, 75);

    doc.setFont("DM Sans", "bold");
    doc.setFontSize(14);
    doc.text(`NOVINCEPT`, 115, 50);
    doc.setFont("DM Sans", "normal");
    doc.setFontSize(12);
    doc.text(`60 RUE FRANÇOIS 1ER`, 115, 55);
    doc.text(`75008 PARIS`, 115, 60);
    doc.text(`hello@novincept.com`, 115, 65);
    doc.text(`09.72.11.83.49`, 115, 70);
    doc.text(`N° SIRET: 93870246100014`, 115, 75);

    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    doc.text(`Date d'émission: ${date}`, 15, 85);

    const validityDate = new Date();
    validityDate.setDate(validityDate.getDate() + 30);
    const validity = `${validityDate.getDate()}/${validityDate.getMonth() + 1}/${validityDate.getFullYear()}`;
    doc.text(`Date de validité: ${validity}`, 15, 90);

    autoTable(doc, {
        startY: 100,
        head: [["#", "Titre", "Désignation et description", "Quantité", "Prix unitaire", "Montant HT"]],
        body: (formData.prestations || []).map((service: Service, index) => [
          index + 1,
          service.title,
          service.description,
          service.quantity,
          `${parseFloat(service.price.toString()).toFixed(2)}€`,
          `${(parseFloat(service.price.toString()) * service.quantity).toFixed(2)}€`
        ]),
        headStyles: { fillColor: [75, 60, 228] }
        });

    const totalHT = (formData.prestations || []).reduce((acc, s) => acc + (parseFloat(s.price.toString()) * s.quantity), 0);
    const totalTVA = totalHT * (parseFloat(formData.vat || '0') / 100);
    const totalTTC = totalHT + totalTVA;

    const addTotals = (doc, yPosition) => {
      doc.text(`TOTAL HT :`, 150, yPosition + 10, { align: "right" });
      doc.text(`${totalHT.toFixed(2)}€`, 195, yPosition + 10, { align: "right" });
      doc.text(`TOTAL TVA :`, 150, yPosition + 15, { align: "right" });
      doc.text(`${totalTVA.toFixed(2)}€`, 195, yPosition + 15, { align: "right" });
      doc.text(`TOTAL TTC :`, 150, yPosition + 20, { align: "right" });
      doc.text(`${totalTTC.toFixed(2)}€`, 195, yPosition + 20, { align: "right" });
    };

    const finalY = doc.lastAutoTable.finalY || 100;
    const spaceForTotals = 30;
    const spaceForadditionalInfo = 40;

    const addadditionalInfo = (doc, yPosition) => {
      const processPlaceholders = (text, totalTTC) => {
        return text
          .replace(/\[(\d+)%total\]/g, (_, percent) => `${((totalTTC * percent) / 100).toFixed(2)}€`)
          .replace(/\[(\d+)x(\d+)%total\]/g, (_, times, percent) => {
            const amount = (totalTTC * percent) / 100;
            return `${times} mensualités de ${(amount / times).toFixed(2)} €`;
          })
          .replace(/\[(\d+)x(\d+)\]/g, (_, times, amount) => `${times} mensualités de ${parseFloat(amount).toFixed(2)} €`);
      };

      let additionalInfo = processPlaceholders(formData.additionalInfo, totalTTC);
      const parts = additionalInfo.split(/(\n|\*)/);
      let x = 10;
      let y = yPosition;

      parts.forEach((part) => {
        if (part === "\n") {
          x = 10;
          y += 5;
        } else if (part === "*") {
          doc.setFont("DM Sans", doc.getFont().fontStyle === "bold" ? "normal" : "bold");
        } else {
          const pageHeight = doc.internal.pageSize.height;
          if (y + 10 > pageHeight) {
            doc.addPage();
            x = 10;
            y = 10;
          }
          doc.text(part, x, y);
          x += doc.getTextWidth(part);
        }
      });
    };

    if (finalY + spaceForTotals + spaceForadditionalInfo > doc.internal.pageSize.height) {
      doc.addPage();
      addTotals(doc, 10);
      addadditionalInfo(doc, 40);
    } else if (finalY + spaceForTotals > doc.internal.pageSize.height) {
      doc.addPage();
      addTotals(doc, 10);
      addadditionalInfo(doc, 40);
    } else {
      addTotals(doc, finalY);
      if (finalY + spaceForadditionalInfo > doc.internal.pageSize.height) {
        doc.addPage();
        addadditionalInfo(doc, 10);
      } else {
        addadditionalInfo(doc, finalY + spaceForTotals);
      }
    }

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl((prevUrl) => {
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      return url;
    });
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'devis.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderPDFOnCanvas = async (url: string) => {
    if (isRendering) return;

    if (currentRenderTask.current) {
      currentRenderTask.current.cancel();
    }

    setIsRendering(true);

    try {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const renderPage = async (pageNum: number) => {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        if (!canvasRefs.current[pageNum - 1]) {
          const newCanvas = document.createElement('canvas');
          newCanvas.className = "w-full flex-grow rounded-xl mb-4";
          canvasRefs.current[pageNum - 1] = newCanvas;
          document.getElementById('pdf-canvas-container')!.appendChild(newCanvas);
        }
        const canvas = canvasRefs.current[pageNum - 1];
        const context = canvas.getContext("2d");

        // Set canvas dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the page
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        await renderTask.promise;
      };

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        await renderPage(pageNum);
      }
    } catch (error) {
      if ((error as any).name !== 'RenderingCancelledException') {
        console.error('Erreur de rendu du PDF:', error);
      }
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      generatePDF();
    }, 70);
    return () => {
      clearTimeout(timeoutRef.current);
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [formData]);

  useEffect(() => {
    if (pdfUrl) {
      renderPDFOnCanvas(pdfUrl);
    }
  }, [pdfUrl]);

  return (
    <div className="w-full md:w-2/3 flex flex-col items-center justify-center md:ml-[33.33%] relative">
      <button
        onClick={downloadPDF}
        className="absolute top-0 right-0 m-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
      >
        Télécharger PDF
      </button>
      <div className="bg-transparent flex flex-col shadow-xl rounded-xl w-full max-w-[600px]">
        <div id="pdf-canvas-container" className="flex flex-col items-center w-full"></div>
      </div>
    </div>
  );
}