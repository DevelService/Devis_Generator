import { useState, useEffect } from 'react';
import ClientForm from './Form/ClientForm';
import DocForm from './Form/DocForm';
import InfoForm from './Form/InfoForm';

interface FormProps {
	formData: {
		company: string;
		siren: string;
		address: string;
		email: string;
		phone: string;
		vat: string;
		quoteNumber: string;
		prestations: {
			title: string;
			description: string;
			price: number;
			quantity: number;
		}[];
		additionalInfo: string;
		documentType: 'quote' | 'invoice';
	};
	handleChange: (formData: any) => void;
	confirmAndRemoveAllPrestations: () => void; // New prop
	removeAllPrestations: () => void; // New prop
}

export default function Form({
	formData,
	handleChange,
	confirmAndRemoveAllPrestations,
	removeAllPrestations,
}: FormProps) {
	const [prestations, setPrestations] = useState(formData.prestations || []);
	const [expanded, setExpanded] = useState(prestations.map(() => true));
	const [adding, setAdding] = useState(false);
	const [removingIndex, setRemovingIndex] = useState<number | null>(null);

	const [documentType, setDocumentType] = useState(
		formData.documentType || 'quote'
	);

	useEffect(() => {
		handleChange({ ...formData, prestations });
	}, [prestations]);

	useEffect(() => {
		setPrestations(formData.prestations);
		setExpanded(formData.prestations.map(() => true));
	}, [formData.prestations]);

	const addPrestation = () => {
		setAdding(true);
		setPrestations([
			...prestations,
			{ title: '', description: '', price: NaN, quantity: NaN },
		]);
		setExpanded([...expanded, true]);
		setTimeout(() => setAdding(false), 500);
	};

	const handlePrestationChange = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		if (name) {
			const newPrestations = prestations.map((prestation, i) => {
				if (i === index) {
					return {
						...prestation,
						[name]:
							name === 'price' || name === 'quantity'
								? value === ''
									? NaN
									: Number(value)
								: value,
					};
				}
				return prestation;
			});
			setPrestations(newPrestations);
		}
	};

	const handleFieldChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		if (name) {
			if (name === 'vat' && value !== '') {
				const vatValue = Math.max(-100, Math.min(100, Number(value)));
				handleChange({ ...formData, [name]: vatValue });
			} else if (name === 'siren' && value.length <= 9) {
				handleChange({ ...formData, [name]: value });
			} else if (name !== 'siren') {
				handleChange({ ...formData, [name]: value });
			}
		}
	};

	const toggleExpand = (index: number) => {
		const newExpanded = expanded.map((exp, i) =>
			i === index ? !exp : exp
		);
		setExpanded(newExpanded);
	};

	const removePrestation = (index: number) => {
		setRemovingIndex(index);
		setTimeout(() => {
			const newPrestations = prestations.filter((_, i) => i !== index);
			setPrestations(newPrestations);
			const newExpanded = expanded.filter((_, i) => i !== index);
			setExpanded(newExpanded);
			setRemovingIndex(null);
		}, 500);
	};

	const toggleDocumentType = () => {
		const newDocumentType = documentType === 'quote' ? 'invoice' : 'quote';
		setDocumentType(newDocumentType);
		handleChange({ ...formData, documentType: newDocumentType });
	};

	return (
		<div className="md:fixed md:top-0 md:left-0 md:h-full md:w-1/3 w-full bg-white p-6 shadow-md overflow-y-auto">
			<h1 className="text-2xl font-bold mb-4 text-gray-800">
				Génération de {documentType === 'quote' ? 'Devis' : 'Factures'}
			</h1>
			<button
				type="button"
				onClick={toggleDocumentType}
				className="bg-[#4B3CE4] text-white px-4 py-2 rounded-lg mb-4"
			>
				{documentType === 'quote'
					? 'Passer à la Facture'
					: 'Passer au Devis'}
			</button>
			<form className="space-y-4">
				<ClientForm
					formData={formData}
					handleFieldChange={handleFieldChange}
				/>

				<hr className="my-4 border-gray-300" />

				<DocForm
					documentType={documentType}
					formData={formData}
					handleFieldChange={handleFieldChange}
					prestations={prestations}
					expanded={expanded}
					setExpanded={setExpanded}
					addPrestation={addPrestation}
					toggleExpand={toggleExpand}
					removePrestation={removePrestation}
					handlePrestationChange={handlePrestationChange}
					confirmAndRemoveAllPrestations={
						confirmAndRemoveAllPrestations
					}
					removeAllPrestations={removeAllPrestations}
					removingIndex={removingIndex}
					setRemovingIndex={setRemovingIndex}
					adding={adding}
				/>

				<hr className="my-4 border-gray-300" />

				<InfoForm
					formData={formData}
					handleFieldChange={handleFieldChange}
				/>
			</form>
		</div>
	);
}
