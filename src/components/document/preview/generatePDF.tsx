import jsPDF from 'jspdf';
import { template } from './template';

export const generatePDF = async (
    data: any,
    setPdfUrl: (url: string | null) => void
) => {
    try {
        const doc = new jsPDF();

        const url = await template(doc, data);
        if (!url) {
            throw new Error('Erreur lors de la génération du PDF');
        }
        setPdfUrl(url);
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
    }
};
