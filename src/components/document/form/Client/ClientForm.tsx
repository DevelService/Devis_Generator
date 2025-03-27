'use client';

import { Data, Individual, Pro } from '@/interfaces/document';
import { useState } from 'react';

interface ClientProps {
	setSearchTriggered: (triggered: boolean) => void;
	handleChangeData: (key: string, value: string) => void;
	data: Data;
}

interface ClientFormProps extends ClientProps {
	setShowForm: (show: boolean) => void;
}

export default function ClientForm({
	setSearchTriggered,
	handleChangeData,
	data,
	setShowForm,
}: ClientFormProps) {
	const [isCompany, setIsCompany] = useState(false);

	const handleSwitchChangeCompany = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setIsCompany(event.target.checked);
		handleChangeData('client.nom', '');
		handleChangeData('client.prenom', '');
		handleChangeData('client.entreprise', '');
		handleChangeData('client.siren', '');
		handleChangeData(
			'client.type',
			event.target.checked ? 'pro' : 'individual'
		);
	};

	const handleCancel = () => {
		handleChangeData('client.nom', '');
		handleChangeData('client.prenom', '');
		handleChangeData('client.email', '');
		handleChangeData('client.tel', '');
		handleChangeData('client.adresse', '');
		handleChangeData('client.entreprise', '');
		handleChangeData('client.siren', '');
		setShowForm(false);
		setSearchTriggered(true);
	};

	const handleSave = async () => {
		const clientData = {
			...data.client,
			type: isCompany ? 'pro' : 'individual',
		};

		try {
			const response = await fetch('/api/client', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(clientData),
			});

			if (!response.ok) {
				const error = await response.json();
				console.error('Error saving client:', error);
				alert('Failed to save client. Please try again.');
				return;
			}

			const result = await response.json();
			console.log('Client saved successfully:', result);
			setShowForm(false);
		} catch (error) {
			console.error('Error saving client:', error);
			alert('An error occurred while saving. Please try again.');
		}
		setSearchTriggered(true);
	};

	return (
		<section>
			<div className="flex flex-col gap-9">
				<div className="flex flex-row w-full items-center justify-end gap-2">
					<i
						className={`fa fa-user transition-colors duration-300 ${
							isCompany ? 'text-gray-400' : 'text-gray-600'
						}`}
					></i>
					<label className="flex h-4 w-12 cursor-pointer items-center rounded-full bg-gray-300 transition has-[:checked]:bg-gray-600">
						<input
							className="peer sr-only"
							id="switch-company"
							type="checkbox"
							onChange={handleSwitchChangeCompany}
						/>
						<span className="m-1 flex h-2 w-2 items-center justify-center rounded-full bg-gray-300 ring-[2px] ring-inset ring-white transition-all peer-checked:translate-x-8 peer-checked:bg-white peer-checked:ring-transparent"></span>
					</label>
					<i
						className={`fa fa-building transition-colors duration-300 ${
							isCompany ? 'text-gray-600' : 'text-gray-400'
						}`}
					></i>
				</div>

				<div className="grid grid-cols-2 gap-3">
					{isCompany ? (
						<>
							<div className="flex flex-col gap-2 w-full max-w-72">
								<div className="flex flex-row gap-1 w-full">
									<h5 className="text-[#3F3F46]">SIREN</h5>
									<span className="text-[#4B3CE4]">*</span>
								</div>
								<input
									id="siren-client"
									type="text"
									placeholder="SIREN"
									className="w-full h-12 border border-gray-300 rounded-md p-3"
									onChange={(event) =>
										handleChangeData(
											'client.siren',
											(event.target as HTMLInputElement)
												.value
										)
									}
								/>
							</div>
							<div className="flex flex-col gap-2 w-full max-w-72">
								<div className="flex flex-row gap-1 w-full">
									<h5 className="text-[#3F3F46]">
										Entreprise
									</h5>
									<span className="text-[#4B3CE4]">*</span>
								</div>
								<input
									id="entreprise-client"
									type="text"
									placeholder="Entreprise"
									className="w-full h-12 border border-gray-300 rounded-md p-3"
									onChange={(event) =>
										handleChangeData(
											'client.entreprise',
											(event.target as HTMLInputElement)
												.value
										)
									}
								/>
							</div>
						</>
					) : (
						<>
							<div className="flex flex-col gap-2 w-full max-w-72">
								<div className="flex flex-row gap-1 w-full">
									<h5 className="text-[#3F3F46]">Nom</h5>
									<span className="text-[#4B3CE4]">*</span>
								</div>
								<input
									id="nom-client"
									type="text"
									placeholder="Smith"
									className="w-full h-12 border border-gray-300 rounded-md p-3"
									onChange={(event) =>
										handleChangeData(
											'client.nom',
											(event.target as HTMLInputElement)
												.value
										)
									}
								/>
							</div>
							<div className="flex flex-col gap-2 w-full max-w-72">
								<div className="flex flex-row gap-1 w-full">
									<h5 className="text-[#3F3F46]">Prénom</h5>
									<span className="text-[#4B3CE4]">*</span>
								</div>
								<input
									id="prenom-client"
									type="text"
									placeholder="John"
									className="w-full h-12 border border-gray-300 rounded-md p-3"
									onChange={(event) =>
										handleChangeData(
											'client.prenom',
											(event.target as HTMLInputElement)
												.value
										)
									}
								/>
							</div>
						</>
					)}
					<div className="flex flex-col gap-2 w-full max-w-72">
						<div className="flex flex-row gap-1 w-full">
							<h5 className="text-[#3F3F46]">Email</h5>
							<span className="text-[#4B3CE4]">*</span>
						</div>
						<div className="relative">
							<i className="fa fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
							<input
								id="email-client"
								type="text"
								placeholder="John.smith@exemple.com"
								className="w-full h-12 border border-gray-300 rounded-md p-3 pl-10"
								onChange={(event) =>
									handleChangeData(
										'client.email',
										(event.target as HTMLInputElement).value
									)
								}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2 w-full max-w-72">
						<div className="flex flex-row gap-1 w-full">
							<h5 className="text-[#3F3F46]">Téléphone</h5>
						</div>
						<div className="relative">
							<i className="fa fa-phone absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
							<input
								id="tel-client"
								type="text"
								placeholder="00 00 00 00 00"
								className="w-full h-12 border border-gray-300 rounded-md p-3 pl-10"
								onChange={(event) =>
									handleChangeData(
										'client.tel',
										(event.target as HTMLInputElement).value
									)
								}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2 w-full col-span-2">
						<div className="flex flex-row gap-1 w-full">
							<h5 className="text-[#3F3F46]">Adresse</h5>
							<span className="text-[#4B3CE4]">*</span>
						</div>
						<div className="relative">
							<i className="fa fa-location-arrow absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
							<input
								id="adresse-client"
								type="text"
								placeholder="Adresse complète"
								className="w-full h-12 border border-gray-300 rounded-md p-3 pl-10"
								onChange={(event) =>
									handleChangeData(
										'client.adresse',
										(event.target as HTMLInputElement).value
									)
								}
							/>
						</div>
					</div>
				</div>
				<div className="flex justify-end gap-2">
					<button
						onClick={handleCancel}
						className="p-2 bg-gray-500 text-white rounded"
					>
						Annuler
					</button>
					<button
						onClick={handleSave}
						className="p-2 bg-blue-500 text-white rounded"
					>
						Enregistrer
					</button>
				</div>
			</div>
		</section>
	);
}
