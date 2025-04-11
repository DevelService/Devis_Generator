import jsPDF from 'jspdf';

export const generatePDF = async (
    data: any,
    setPdfUrl: (url: string | null) => void
) => {
    try {
        data.template_name = data.template_name || 'default-template';

        // Vérification si le template est premium
        const response = await fetch(`/api/template/check-premium?name=${data.template_name}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la vérification du template');
        }

        const { isPremium, hasAccess } = await response.json();
        if (isPremium && !hasAccess) {
            throw new Error('Vous n\'avez pas accès à ce template premium');
        }

        // Importation dynamique du template
        const { template } = await import(`/src/uploads/template/${data.template_name}`);

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
