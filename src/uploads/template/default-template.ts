import autoTable from 'jspdf-autotable';
import dmSansRegular from '@/fonts/DMSans-Regular';
import dmSansBold from '@/fonts/DMSans-Bold';
import { Prestation, Reduction } from '@/interfaces/document'; // Updated import
import { svg2pdf } from 'svg2pdf.js';
import jsPDF from 'jspdf';

export const template = async (doc: any, data: any) => {
    try {
        const COMPANY_RIB = process.env.COMPANY_RIB;

        if (!dmSansRegular || !dmSansBold) {
            console.error('Les polices ne sont pas correctement importées.');
            return;
        }

        doc.addFileToVFS('DMSans-Regular.ttf', dmSansRegular);
        doc.addFont('DMSans-Regular.ttf', 'DM Sans', 'normal');
        doc.addFileToVFS('DMSans-Bold.ttf', dmSansBold);
        doc.addFont('DMSans-Bold.ttf', 'DM Sans', 'bold');

        doc.setFont('DM Sans');

        if (!data || !data.prestations) {
            console.error('Les données du formulaire sont manquantes ou incorrectes.');
            return;
        }

        doc.setFontSize(24);
        doc.setFont('DM Sans', 'bold');
        doc.setTextColor('#4B3CE4');
        const documentTitle = data.documentType === 'devis' ? 'Devis' : 'Facture';
        doc.text(documentTitle, 15, 20);
        doc.setTextColor('#374151');
        doc.setFontSize(20);
        doc.text(`N° ${data.numero_document}`, 15, 30);

        doc.setFont('DM Sans', 'bold');
        doc.setFontSize(14);
        doc.text(`${(data.company || '[Entreprise]').toUpperCase()}`, 15, 50);
        doc.setFont('DM Sans', 'normal');
        doc.setFontSize(12);

        const siren = data.siren ? `N° SIREN: ${data.siren}\n` : '';
        const addressParts = data.address
            ? data.address.split(', ').map((part: string) => (part ? part + '\n' : ''))
            : ['[ADRESSE]\n', '[CODE POSTAL]\n'];
        const address1 = addressParts[0] ? addressParts[0].toUpperCase() : '';
        const address2 = addressParts[1] ? addressParts[1].toUpperCase() : '';
        const email = data.email ? data.email + '\n' : '';
        const phone = data.phone ? data.phone + '\n' : '';
        doc.text(`${siren}${address1}${address2}${email}${phone}`, 15, 55);

        doc.setFont('DM Sans', 'bold');
        doc.setFontSize(14);
        doc.text(`${process.env.COMPANY_NAME}`, 115, 50);
        doc.setFont('DM Sans', 'normal');
        doc.setFontSize(12);

        const siren_comp = process.env.COMPANY_SIREN ? `N° SIREN: ${process.env.COMPANY_SIREN}\n` : '';
        const addressParts_comp = process.env.COMPANY_ADDRESS
            ? process.env.COMPANY_ADDRESS.split(', ').map((part: string) => (part ? part + '\n' : ''))
            : ['[ADRESSE]\n', '[CODE POSTAL]\n'];
        const address1_comp = addressParts_comp[0] ? addressParts_comp[0].toUpperCase() : '';
        const address2_comp = addressParts_comp[1] ? addressParts_comp[1].toUpperCase() : '';
        const email_comp = process.env.COMPANY_EMAIL ? process.env.COMPANY_EMAIL + '\n' : '';
        const phone_comp = process.env.COMPANY_PHONE ? process.env.COMPANY_PHONE + '\n' : '';
        doc.text(`${siren_comp}${address1_comp}${address2_comp}${email_comp}${phone_comp}`, 115, 55);

        const formatDate = (date: Date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        const today = new Date();
        const date = formatDate(today);
        doc.text(`Date d'émission: ${date}`, 15, 85);

        const validityDate = new Date();
        validityDate.setDate(validityDate.getDate() + 30);
        const validity = formatDate(validityDate);
        doc.text(`Date de validité: ${validity}`, 15, 90);

        // Regroup identical prestations and calculate their quantities
        const prestations = data.prestations.reduce((acc: any, prestation: Prestation) => {
            const key = `${prestation.titre}-${prestation.description}-${prestation.prix}`;
            if (!acc[key]) {
                acc[key] = { ...prestation, quantite: 1 };
            } else {
                acc[key].quantite += 1;
            }
            return acc;
        }, {});

        autoTable(doc, {
            startY: 100,
            head: [
            [
                { content: '#', styles: { minCellWidth: 12, halign: 'center', fontSize: 9 } },
                { content: 'Désignation et description', styles: { minCellWidth: 50, fontSize: 9 } },
                { content: 'Qté', styles: { minCellWidth: 10, fontSize: 9 } },
                { content: 'PU HT', styles: { minCellWidth: 15, fontSize: 9 } },
                { content: 'TVA %', styles: { minCellWidth: 10, fontSize: 9 } },
                { content: 'TVA €', styles: { minCellWidth: 20, fontSize: 9 } },
                { content: 'Total TTC', styles: { minCellWidth: 20, fontSize: 9 } },
            ],
            ],
            body: (Object.values(prestations) as Prestation[]).map(
            (prestation: Prestation, index: number) => {
                const priceHT = prestation.prix * prestation.quantite;
                const tva = priceHT * 0.2;
                const total = priceHT + tva;

                return [
                { content: index + 1, styles: { halign: 'center', valign: 'middle' } },
                { content: `${prestation.titre}\n${prestation.description}`, styles: { valign: 'middle' } },
                { content: prestation.quantite, styles: { halign: 'center', valign: 'middle' } },
                { content: `${prestation.prix}€`, styles: { halign: 'center', valign: 'middle' } },
                { content: `20%`, styles: { halign: 'center', valign: 'middle' } },
                { content: `${tva.toFixed(2)}€`, styles: { halign: 'center', valign: 'middle' } },
                { content: `${total.toFixed(2)}€`, styles: { halign: 'center', valign: 'middle' } },
                ];
            }
            ),
            headStyles: { fillColor: [75, 60, 228], cellPadding: 3, lineWidth: 1, lineColor: [255, 255, 255] },
            bodyStyles: { fillColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [255, 255, 255] },
            didDrawCell: (data) => {
            const doc = data.doc;
            const rows = data.table.body;
            if (data.row.index < rows.length - 1) {
                doc.setDrawColor(200, 200, 200);
                doc.line(
                data.cell.x,
                data.cell.y + data.cell.height,
                data.cell.x + data.cell.width,
                data.cell.y + data.cell.height
                );
            }
            },
        });

        const finalY = (doc as any).lastAutoTable.finalY || 100;
        const spaceForTotals = 30;
        const spaceForadditionalInfo = 40;

        const totalHT = (Object.values(prestations) as Prestation[]).reduce(
            (acc: number, p: Prestation) => acc + parseFloat(p.prix.toString()) * p.quantite,
            0
        );

        const totalReductions = (data.reductions || []).reduce(
            (acc: number, reduction: Reduction) => {
            if (reduction.percentage) {
                return acc + (totalHT * reduction.percentage) / 100;
            }
            return acc + reduction.montant;
            },
            0
        );

        const netHT = totalHT;
        const totalTVA = netHT * (parseFloat(data.vat || '0') / 100);
        const totalTTC = netHT + totalTVA;

        const addTotals = (doc: jsPDF, yPosition: number) => {
            doc.setFont('DM Sans', 'bold');
            doc.text(`TOTAL HT :`, 125, yPosition + 10);
            doc.setFont('DM Sans', 'normal');
            doc.text(`${totalHT.toFixed(2)}€`, 195, yPosition + 10, {
                align: 'right',
            });
            doc.setFont('DM Sans', 'bold');
            doc.text(`TOTAL TVA :`, 125, yPosition + 22);
            doc.setFont('DM Sans', 'normal');
            doc.text(`${totalTVA.toFixed(2)}€`, 195, yPosition + 22, {
                align: 'right',
            });
            const rectX = 120;
            const rectY = yPosition + 28;
            const rectWidth = 80;
            const rectHeight = 10;
            const cornerRadius = 3;

            doc.setFillColor(220, 220, 220);
            doc.roundedRect(rectX, rectY, rectWidth, rectHeight, cornerRadius, cornerRadius, 'F');

            doc.setFont('DM Sans', 'bold');
            doc.text(`TOTAL TTC :`, 125, yPosition + 34);
            doc.setFont('DM Sans', 'normal');
            doc.text(`${totalTTC.toFixed(2)}€`, 195, yPosition + 34, {
                align: 'right',
            });
            doc.setFont('DM Sans', 'normal');
        };

        const addPaymentAndBalanceInfo = (doc: jsPDF, yPosition: number) => {
            const processPlaceholders = (text: string, totalTTC: number) => {
                if (!text) return '';
                return text
                    .replace(
                        /\[(\d+)%total\]/g,
                        (_, percent) =>
                            `${((totalTTC * percent) / 100).toFixed(2)}€`
                    )
                    .replace(/\[(\d+)x(\d+)%total\]/g, (_, times, percent) => {
                        const amount = (totalTTC * percent) / 100;
                        return `${times} mensualités de ${(
                            amount / times
                        ).toFixed(2)} €`;
                    })
                    .replace(
                        /\[(\d+)x(\d+)\]/g,
                        (_, times, amount) =>
                            `${times} mensualités de ${parseFloat(
                                amount
                            ).toFixed(2)} €`
                    );
            };

            let paymentInfo = processPlaceholders(
                data.paymentInfo,
                totalTTC
            );
            let balanceInfo = processPlaceholders(
                data.balanceInfo,
                totalTTC
            );

            const addText = (text: string, x: number, y: number) => {
                const parts = text.split(/(\n|\*)/);
                let currentX = x;
                let currentY = y;

                parts.forEach((part) => {
                    if (part === '\n') {
                        currentX = x;
                        currentY += 5;
                    } else if (part === '*') {
                        doc.setFont(
                            'DM Sans',
                            doc.getFont().fontStyle === 'bold' ? 'normal' : 'bold'
                        );
                    } else {
                        const pageHeight = doc.internal.pageSize.height;
                        if (currentY + 10 > pageHeight) {
                            doc.addPage();
                            currentX = x;
                            currentY = 10;
                        }
                        doc.text(part, currentX, currentY);
                        currentX += doc.getTextWidth(part);
                    }
                });

                return currentY;
            };

            let currentY = yPosition;
            doc.setFont('DM Sans', 'bold');
            doc.text('Paiement', 10, currentY);
            doc.setFont('DM Sans', 'normal');
            currentY = addText(paymentInfo, 10, currentY + 5) + 10;

            doc.setFont('DM Sans', 'bold');
            doc.text('Solde', 10, currentY);
            doc.setFont('DM Sans', 'normal');
            currentY = addText(balanceInfo, 10, currentY + 5) + 10;

            doc.setFont('DM Sans', 'bold');
            doc.text('Mode de paiement', 10, currentY);
            doc.setFont('DM Sans', 'normal');
            addText(`Virement bancaire ou Carte bancaire\nRIB : ${COMPANY_RIB}`, 10, currentY + 5);
        };

        if (
            finalY + spaceForTotals + spaceForadditionalInfo >
            doc.internal.pageSize.height
        ) {
            doc.addPage();
            addTotals(doc, 10);
            addPaymentAndBalanceInfo(doc, 40);
        } else if (finalY + spaceForTotals > doc.internal.pageSize.height) {
            doc.addPage();
            addTotals(doc, 10);
            addPaymentAndBalanceInfo(doc, 40);
        } else {
            addTotals(doc, finalY);
            if (
                finalY + spaceForadditionalInfo >
                doc.internal.pageSize.height - 80
            ) {
                doc.addPage();
                addPaymentAndBalanceInfo(doc, 10);
            } else {
                addPaymentAndBalanceInfo(doc, finalY + spaceForTotals);
            }
        }

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        return url;
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
    }
    return null;
};