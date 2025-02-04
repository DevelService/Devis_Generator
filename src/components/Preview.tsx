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
    documentType: 'quote' | 'invoice';
  };
}

export default function Preview({ formData }: PreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [canDownload, setCanDownload] = useState(true);
  const [sirenData, setSirenData] = useState<any>(null);
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
    const documentTitle = formData.documentType === 'quote' ? 'Devis' : 'Facture';
    doc.text(documentTitle, 15, 20);
    doc.setTextColor("#374151");
    doc.setFontSize(20);
    doc.setFont("DM Sans", "bold");
    const documentNumberPrefix = formData.documentType === 'quote' ? 'N° D-' : 'N° F-';
    doc.text(`${documentNumberPrefix}${formData.quoteNumber}`, 15, 30);

    doc.setFont("DM Sans", "bold");
    doc.setFontSize(14);
    doc.text(`${(formData.company || "[Entreprise]").toUpperCase()}`, 15, 50);
    doc.setFont("DM Sans", "normal");
    doc.setFontSize(12);
    doc.text(`N° SIREN: ${formData.siret || "[SIREN]"}`, 15, 55);
    
    const addressParts = formData.address ? formData.address.split(', ').map(part => part ? part + "\n" : "") : ["[ADRESSE]\n", "[CODE POSTAL]\n"];
    const address1 = addressParts[0] ? addressParts[0].toUpperCase() : "";
    const address2 = addressParts[1] ? addressParts[1].toUpperCase() : "";
    const email = formData.email ? formData.email + "\n" : "";
    const phone = formData.phone ? formData.phone + "\n" : "";
    doc.text(`${address1}${address2}${email}${phone}`, 15, 60);

    doc.setFont("DM Sans", "bold");
    doc.setFontSize(14);
    doc.text(`NOVINCEPT`, 115, 50);
    doc.setFont("DM Sans", "normal");
    doc.setFontSize(12);

    doc.text(`N° SIREN: 938702461`, 115, 55);
    doc.text(`60 RUE FRANÇOIS 1ER`, 115, 60);
    doc.text(`75008 PARIS`, 115, 65);
    doc.text(`hello@novincept.com`, 115, 70);
    doc.text(`09 72 11 83 49`, 115, 75);

    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    doc.text(`Date d'émission: ${date}`, 15, 85);

    const validityDate = new Date();
    validityDate.setDate(validityDate.getDate() + 30);
    const validity = `${validityDate.getDate()}/${validityDate.getMonth() + 1}/${validityDate.getFullYear()}`;
    doc.text(`Date de validité: ${validity}`, 15, 90);

    autoTable(doc, {
        startY: 100,
        head: [["#", "Désignation et description", "Quantité", "Prix unitaire", "Montant HT"]],
        body: (formData.prestations || []).map((service: Service, index) => [
          index + 1,
          `${service.title}\n${service.description}`,
          service.quantity,
          `${parseFloat(service.price.toString()).toFixed(2)}€`,
          `${(parseFloat(service.price.toString()) * service.quantity).toFixed(2)}€`
        ]),
        headStyles: { fillColor: [75, 60, 228] },
        bodyStyles: { fillColor: [255, 255, 255] },  // Blanc pour enlever le fond gris
        alternateRowStyles: { fillColor: [255, 255, 255] },  // Blanc pour les lignes alternées
        didDrawCell: (data) => {
          const doc = data.doc;
          const rows = data.table.body;
          if (data.row.index < rows.length - 1) {
            doc.setDrawColor(200, 200, 200);  // Gris clair
            doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
          }
        }
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

  const validateForm = () => {
    const fieldsToValidate = ['company', 'siret', 'address', 'quoteNumber', 'vat', 'additionalInfo'];
    let allValid = true;

    fieldsToValidate.forEach(fieldId => {
        const value = (formData as any)[fieldId];
        let isValid = true;
        switch (fieldId) {
            case 'vat':
                isValid = /^[A-Z0-9]{2,12}$/.test(value);
                break;
            case 'siret':
                isValid = /^[0-9]{9}$/.test(value);
            case 'quoteNumber':
                isValid = /^[0-9]{4}-[0-9]{4}$/.test(value);
                break;
            case 'vat':
                isValid = /^[0-9]{1,3}$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 100;
                break;
            default:
                isValid = !!value;
        }
        const field = document.getElementById(fieldId);
        if (!isValid) {
            if (field) field.classList.add('border-red-600');
            allValid = false;
        } else {
            if (field) field.classList.remove('border-red-600');
        }
    });

    setIsFormValid(allValid);
  };

  const fetchSirenData = async (siret: string) => {
    try {
      const response = await fetch(`https://api.insee.fr/entreprises/sirene/V3.11/siren/${siret}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer 6f5b3a55-45b5-3d70-9818-956e47a16f5b'
        }
      });
      const siretInput = document.getElementById('siret');
      const companyInput = document.getElementById('company');
      if (!response.ok) {
        console.warn('Network response was not ok, using fallback data');
        if (siretInput) {
            siretInput.classList.add('border-red-600');
        }
        if (companyInput) {
            (companyInput as HTMLInputElement).value = "";
            formData.company = "";
        }
        setCanDownload(false);
      } else {
        const data = await response.json();
        console.log(data);
        setSirenData(data);
        if (siretInput && siretInput.classList.contains('border-red-600')) {
          siretInput.classList.remove('border-red-600');
        }
        if (companyInput) {
          (companyInput as HTMLInputElement).value = data.uniteLegale.periodesUniteLegale[0].denominationUniteLegale;
          formData.company = data.uniteLegale.periodesUniteLegale[0].denominationUniteLegale;
          companyInput.classList.remove('border-red-600');
        }
        setCanDownload(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      const siretInput = document.getElementById('siret');
      const companyInput = document.getElementById('company');
      if (siretInput) {
        siretInput.classList.add('border-red-600');
      }
      if (companyInput) {
            (companyInput as HTMLInputElement).value = "";
            formData.company = "";
        }
      setCanDownload(false);
    }
  };

  const downloadPDF = async () => {
    if (!isFormValid) {
      console.warn('Validation failed, not downloading PDF');
      return;
    }

    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${formData.documentType === 'quote' ? 'D-' : 'F-'}${formData.quoteNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetCanvases = () => {
    const container = document.getElementById('pdf-canvas-container');
    if (container) {
      container.innerHTML = '';
      canvasRefs.current = [];
    }
  };

  const renderPDFOnCanvas = async (url: string) => {
    if (isRendering) return;

    if (currentRenderTask.current) {
      currentRenderTask.current.cancel();
    }

    setIsRendering(true);
    resetCanvases();

    try {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const renderPage = async (pageNum: number) => {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        const newCanvas = document.createElement('canvas');
        newCanvas.className = "w-full flex-grow rounded-xl";
        canvasRefs.current[pageNum - 1] = newCanvas;
        document.getElementById('pdf-canvas-container')!.appendChild(newCanvas);

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
    validateForm();
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      generatePDF();
    }, 300);
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

  useEffect(() => {
    if (formData.siret.length === 9) {
      fetchSirenData(formData.siret);
    } else {
        const companyInput = document.getElementById('company');
        (companyInput as HTMLInputElement).value = "";
        formData.company = "";
    }
  }, [formData.siret]);

  return (
    <div className="w-full md:w-2/3 flex flex-col items-center justify-center md:ml-[33.33%] relative">
      <button
        onClick={downloadPDF}
        className={`absolute top-0 right-0 m-4 px-4 py-2 bg-[#4B3CE4] text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ${!isFormValid || !canDownload ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isFormValid || !canDownload}
      >
        Télécharger {formData.documentType === 'quote' ? 'le devis' : 'la facture'}
      </button>
      <div className="bg-transparent flex flex-col shadow-xl rounded-xl w-full max-w-[600px]">
        <div id="pdf-canvas-container" className="flex flex-col items-center w-full gap-4"></div>
      </div>
    </div>
  );
}