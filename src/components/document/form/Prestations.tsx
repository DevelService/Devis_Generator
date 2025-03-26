'use client';

import TitreSection from './SectionAssets/TitreSection';
import { useState } from 'react';
import { Prestation } from '@/interfaces/document';

interface PrestationsProps {
	handleChangeData: (key: string, value: any) => void;
}

export default function Prestations({ handleChangeData }: PrestationsProps) {
	const [prestations, setPrestations] = useState<Prestation[]>([
		{ id: 1, titre: '', description: '', prix: 0, quantite: 0 },
	]);
	const [collapsed, setCollapsed] = useState<boolean[]>([false]);

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		index: number,
		field: keyof Prestation
	) => {
		const newPrestations = [...prestations];
		const value =
			field === 'prix' || field === 'quantite'
				? Number(event.target.value)
				: event.target.value;
		newPrestations[index][field] = value as never;
		setPrestations(newPrestations);
		handleChangeData('prestations', newPrestations);
	};

	const toggleCollapse = (index: number) => {
		const newCollapsed = [...collapsed];
		newCollapsed[index] = !newCollapsed[index];
		setCollapsed(newCollapsed);
	};

	const ajouterPrestation = () => {
		const nouvellePrestation = {
			id: prestations.length + 1,
			titre: '',
			description: '',
			prix: 0,
			quantite: 0,
		};
		setPrestations([...prestations, nouvellePrestation]);
		setCollapsed([...collapsed, false]);
		handleChangeData('prestations', [...prestations, nouvellePrestation]);
	};

	const supprimerPrestation = (id: number) => {
		const newPrestations = prestations.filter(
			(prestation) => prestation.id !== id
		);
		setPrestations(newPrestations);
		setCollapsed(newPrestations.map(() => false));
		handleChangeData('prestations', newPrestations);
	};

	const supprimerToutesPrestations = () => {
		setPrestations([]);
		setCollapsed([]);
		handleChangeData('prestations', []);
	};

	return (
		<section className="flex flex-col gap-3">
			<TitreSection
				titre="Prestations"
				description="Ceci est la section des prestations du document."
			/>
			<div className="flex flex-col gap-6">
				{prestations.map((prestation, index) => (
					<div
						key={prestation.id}
						className="flex flex-col bg-[#F6F6F6] rounded-2xl p-3 gap-3"
					>
						<div className="flex justify-between items-center">
							<div
								className="flex items-center cursor-pointer"
								onClick={() => toggleCollapse(index)}
							>
								<p>Prestation n°{index + 1}</p>
								<i
									className={`fas fa-chevron-down ml-2 text-xs ${
										collapsed[index] ? 'rotate-180' : ''
									}`}
								></i>
							</div>
							<i
								className="fas fa-trash-alt text-red-600 cursor-pointer"
								onClick={() =>
									supprimerPrestation(prestation.id)
								}
							></i>
						</div>
						{!collapsed[index] && (
							<>
								<div className="flex flex-col gap-2">
									<div className="flex flex-row gap-1 w-full">
										<h5 className="text-[#3F3F46]">
											Titre de la prestation
										</h5>
										<span className="text-[#4B3CE4]">
											*
										</span>
									</div>
									<div className="relative">
										<input
											id={`titre-prestation#${index}`}
											type="text"
											placeholder="Maquette web"
											className="w-full h-12 border border-gray-300 rounded-md p-3 pl-3"
											value={prestation.titre}
											onChange={(event) =>
												handleInputChange(
													event,
													index,
													'titre'
												)
											}
										/>
									</div>
								</div>
								<div className="flex flex-col gap-2">
									<div className="flex flex-row gap-1 w-full">
										<h5 className="text-[#3F3F46]">
											Description de la prestation
										</h5>
										<span className="text-[#4B3CE4]">
											*
										</span>
									</div>
									<div className="relative">
										<textarea
											id={`description-prestation#${index}`}
											placeholder="Nous voulons un site internet..."
											className="w-full h-20 border border-gray-300 rounded-md p-3 pl-3"
											value={prestation.description}
											onChange={(event) =>
												handleInputChange(
													event,
													index,
													'description'
												)
											}
										/>
									</div>
								</div>
								<div className="flex flex-row gap-3 w-full">
									<div className="flex flex-col gap-2 w-1/2">
										<div className="flex flex-row gap-1 w-full">
											<h5 className="text-[#3F3F46]">
												Prix
											</h5>
											<span className="text-[#4B3CE4]">
												*
											</span>
										</div>
										<div className="relative">
											<i className="fa fa-euro-sign absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
											<input
												id={`prix-prestation#${index}`}
												type="number"
												placeholder="Prix"
												className="w-full h-12 border border-gray-300 rounded-md p-3 pl-10"
												value={prestation.prix}
												onChange={(event) =>
													handleInputChange(
														event,
														index,
														'prix'
													)
												}
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2 w-1/2">
										<div className="flex flex-row gap-1 w-full">
											<h5 className="text-[#3F3F46]">
												Quantité
											</h5>
											<span className="text-[#4B3CE4]">
												*
											</span>
										</div>
										<div className="relative">
											<i className="fa fa-sort-numeric-up absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
											<input
												id={`quantite-prestation#${index}`}
												type="number"
												placeholder="Quantité"
												className="w-full h-12 border border-gray-300 rounded-md p-3 pl-10"
												value={prestation.quantite}
												onChange={(event) =>
													handleInputChange(
														event,
														index,
														'quantite'
													)
												}
											/>
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				))}
			</div>
			<div className="flex flex-row gap-2">
				<button
					onClick={ajouterPrestation}
					className="flex flex-row justify-center items-center p-3 gap-2 h-12 bg-white border border-gray-300 shadow-sm rounded-xl"
				>
					<i className="fas fa-plus mr-2"></i>
					<p>Ajouter une prestation</p>
				</button>
				<button
					onClick={supprimerToutesPrestations}
					className="flex flex-row justify-center items-center p-3 gap-2 h-12 bg-red-600 text-white border border-gray-300 shadow-sm rounded-xl"
				>
					<i className="fas fa-trash-alt mr-2"></i>
					<p>Supprimer les prestations</p>
				</button>
			</div>
		</section>
	);
}
