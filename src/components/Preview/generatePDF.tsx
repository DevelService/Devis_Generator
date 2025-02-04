// generatePDF.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dmSansRegular from '@/fonts/DMSans-Regular';
import dmSansBold from '@/fonts/DMSans-Bold';
import { Service } from "./interfaces";

export const generatePDF = (formData: any, setPdfUrl: (url: string | null) => void) => {
  try {
    const doc = new jsPDF();

    // Ajouter des vérifications pour les polices
    if (!dmSansRegular || !dmSansBold) {
      console.error("Les polices ne sont pas correctement importées.");
      return;
    }

    doc.addFileToVFS("DMSans-Regular.ttf", dmSansRegular);
    doc.addFont("DMSans-Regular.ttf", "DM Sans", "normal");
    doc.addFileToVFS("DMSans-Bold.ttf", dmSansBold);
    doc.addFont("DMSans-Bold.ttf", "DM Sans", "bold");

    doc.setFont("DM Sans");

    // Vérifier les données
    if (!formData || !formData.prestations) {
      console.error("Les données du formulaire sont manquantes ou incorrectes.");
      return;
    }

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

    const siren = formData.siren ? `N° SIREN: ${formData.siren}\n` : "";
    const addressParts = formData.address ? formData.address.split(', ').map((part: string) => part ? part + "\n" : "") : ["[ADRESSE]\n", "[CODE POSTAL]\n"];
    const address1 = addressParts[0] ? addressParts[0].toUpperCase() : "";
    const address2 = addressParts[1] ? addressParts[1].toUpperCase() : "";
    const email = formData.email ? formData.email + "\n" : "";
    const phone = formData.phone ? formData.phone + "\n" : "";
    doc.text(`${siren}${address1}${address2}${email}${phone}`, 15, 55);

    doc.setFont("DM Sans", "bold");
    doc.setFontSize(14);
    doc.text(`${process.env.COMPANY_NAME}`, 115, 50);
    doc.setFont("DM Sans", "normal");
    doc.setFontSize(12);


    const siren_comp = process.env.COMPANY_SIREN ? `N° SIREN: ${process.env.COMPANY_SIREN}\n` : "";
    const addressParts_comp = process.env.COMPANY_ADDRESS ? process.env.COMPANY_ADDRESS.split(', ').map((part: string) => part ? part + "\n" : "") : ["[ADRESSE]\n", "[CODE POSTAL]\n"];
    const address1_comp = addressParts_comp[0] ? addressParts_comp[0].toUpperCase() : "";
    const address2_comp = addressParts_comp[1] ? addressParts_comp[1].toUpperCase() : "";
    const email_comp = process.env.COMPANY_EMAIL ? process.env.COMPANY_EMAIL + "\n" : "";
    const phone_comp = process.env.COMPANY_PHONE ? process.env.COMPANY_PHONE + "\n" : "";
    doc.text(`${siren_comp}${address1_comp}${address2_comp}${email_comp}${phone_comp}`, 115, 55);

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
      body: (formData.prestations || []).map((service: Service, index: number) => [
        index + 1,
        `${service.title}\n${service.description}`,
        service.quantity,
        `${parseFloat(service.price.toString()).toFixed(2)}€`,
        `${(parseFloat(service.price.toString()) * service.quantity).toFixed(2)}€`
      ]),
      headStyles: { fillColor: [75, 60, 228] },
      bodyStyles: { fillColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      didDrawCell: (data) => {
        const doc = data.doc;
        const rows = data.table.body;
        if (data.row.index < rows.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        }
      }
    });

    const totalHT = (formData.prestations || []).reduce((acc: number, s: Service) => acc + (parseFloat(s.price.toString()) * s.quantity), 0);
    const totalTVA = totalHT * (parseFloat(formData.vat || '0') / 100);
    const totalTTC = totalHT + totalTVA;

    const addTotals = (doc: jsPDF, yPosition: number) => {
      doc.text(`TOTAL HT :`, 150, yPosition + 10, { align: "right" });
      doc.text(`${totalHT.toFixed(2)}€`, 195, yPosition + 10, { align: "right" });
      doc.text(`TOTAL TVA :`, 150, yPosition + 15, { align: "right" });
      doc.text(`${totalTVA.toFixed(2)}€`, 195, yPosition + 15, { align: "right" });
      doc.text(`TOTAL TTC :`, 150, yPosition + 20, { align: "right" });
      doc.text(`${totalTTC.toFixed(2)}€`, 195, yPosition + 20, { align: "right" });
    };

    const finalY = (doc as any).lastAutoTable.finalY || 100;
    const spaceForTotals = 30;
    const spaceForadditionalInfo = 40;

    const addadditionalInfo = (doc: jsPDF, yPosition: number) => {
      const processPlaceholders = (text: string, totalTTC: number) => {
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
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
  }
};