'use client';

import NavigationSection from './NavigationSection';
import ClientSection from './ClientSection';
import Header from './Header';
import EmetteurSection from './EmetteurSection';
import Prestations from './Prestations';
import { Data } from '@/interfaces/document';

interface FormProps {
	data: Data;
	handleChangeData: (key: string, value: string) => void;
	handleSwitchChangeDocument: (
		event: React.ChangeEvent<HTMLInputElement>
	) => void;
}

export default function Form({
	data,
	handleChangeData,
	handleSwitchChangeDocument,
}: FormProps) {
	return (
		<div className="flex flex-col gap-12 w-full">
			<NavigationSection
				data={data}
				handleSwitchChangeDocument={handleSwitchChangeDocument}
			/>
			<Header data={data} />

			<EmetteurSection data={data} handleChangeData={handleChangeData} />

			<div className="border border-gray-200"></div>

			<ClientSection data={data} handleChangeData={handleChangeData} />

			<div className="border border-gray-200"></div>

			<Prestations handleChangeData={handleChangeData} />

			<div className="flex flex-row gap-4">
				<button className="bg-blue-500 text-white py-3 px-2 rounded-lg">
					Générer {data.documentType === 'Devis' ? 'le' : 'la'} {data.documentType}
				</button>
			</div>
		</div>
	);
}
