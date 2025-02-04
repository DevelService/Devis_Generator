// interfaces.ts
export interface Service {
	title: string;
	description: string;
	price: number;
	quantity: number;
}

export interface PreviewProps {
	formData: {
		company: string;
		siren: string;
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
