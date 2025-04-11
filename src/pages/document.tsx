'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Form from '@/components/document/form/Form';
import Preview from '@/components/document/preview/Preview';
import { Data } from '@/interfaces/document';
import Header from '@/components/document/Header';

export default function Home() {
	const [data, setData] = useState<Data>({
		id: -1,
		documentType: 'devis',
		company: false,
		date: new Date().toISOString().split('T')[0],
		numero_document: '',
		template_uuid: '',
		emetteur: {
			id: -1,
			score: 0,
			nom: '',
			prenom: '',
			tel: '',
			email: '',
			adresse: '',
			type: 'individual',
		},
		client: {
			id: -1,
			score: 0,
			nom: '',
			prenom: '',
			tel: '',
			email: '',
			adresse: '',
			type: 'individual',
		},
		prestations: [],
	});

  const fetchDocumentNumber = async (documentType: string) => {
		try {
			const response = await fetch(
				`/api/documents/count?type=${documentType}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch document count');
			}
			const { count } = await response.json();
			return count + 1; // Increment to get the next document number
		} catch (error) {
			console.error(
				'Erreur lors de la récupération du numéro de document:',
				error
			);
			return 1; // Default to 1 in case of error
		}
	};

	useEffect(() => {
		const initializeDocumentNumber = async () => {
			const documentNumber = await fetchDocumentNumber(data.documentType);
			const currentYear = new Date().getFullYear();
			data.numero_document =
				data.documentType === 'devis'
					? `D-${currentYear}-${documentNumber
							.toString()
							.padStart(4, '0')}`
					: `F-${currentYear}-${documentNumber
							.toString()
							.padStart(4, '0')}`;
		};

		initializeDocumentNumber();
	}, [data.documentType]);

	const router = useRouter();

	useEffect(() => {
		const validateToken = async () => {
			try {
				const response = await fetch('/api/auth/validate-token', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (response.status !== 200) {
					router.push('/login?redirect=/document');
					return;
				}
			} catch (error) {
				router.push('/login?redirect=/document');
			}
		};

		validateToken();
	}, [router]);

	const handleChangeData = (key: string, value: string) => {
		const keys = key.split('.');
		setData((prev) => {
			let updatedData = { ...prev };
			let temp: any = updatedData;
			for (let i = 0; i < keys.length - 1; i++) {
				temp = temp[keys[i]];
			}
			temp[keys[keys.length - 1]] = value;
			return updatedData;
		});
	};

	const handleSwitchChangeDocument = () => {
		setData((prev) => ({
			...prev,
			documentType: prev.documentType === 'devis' ? 'facture' : 'devis',
		}));
	};

	return (
		<div className="bg-white">
			<Header />
			<div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
				<div className="my-10 mx-4 md:mx-32">
					<Form
						data={data}
						handleChangeData={handleChangeData}
						handleSwitchChangeDocument={handleSwitchChangeDocument}
					/>
				</div>
				<div className="flex justify-center h-full w-full bg-gray-100">
					<Preview data={data} />
				</div>
			</div>
		</div>
	);
}
