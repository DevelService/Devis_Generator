import React from 'react';

interface DocFormProps {
	documentType: 'quote' | 'invoice';
	formData: any;
	handleFieldChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	prestations: {
		title: string;
		description: string;
		price: number;
		quantity: number;
	}[];
	expanded: boolean[];
	setExpanded: (expanded: boolean[]) => void;
	addPrestation: () => void;
	toggleExpand: (index: number) => void;
	removePrestation: (index: number) => void;
	handlePrestationChange: (
		index: number,
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	confirmAndRemoveAllPrestations: () => void;
	removeAllPrestations: () => void;
	removingIndex: number | null;
	setRemovingIndex: (index: number | null) => void;
	adding: boolean;
}

const DocForm = ({
	documentType,
	formData,
	handleFieldChange,
	prestations,
	expanded,
	setExpanded,
	addPrestation,
	toggleExpand,
	removePrestation,
	handlePrestationChange,
	confirmAndRemoveAllPrestations,
	removeAllPrestations,
	removingIndex,
	setRemovingIndex,
	adding,
}: DocFormProps) => {
	return (
		<>
			<p className="text-base font-bold mb-4 text-gray-800">
				{documentType === 'quote' ? 'Le devis' : 'La facture'}
			</p>

			<div className="flex gap-1 flex-col">
				<div className="flex gap-1">
					<label className="font-medium text-xs text-gray-700 block">
						Numéro du{' '}
						{documentType === 'quote' ? 'devis' : 'facture'}
					</label>
					<p className="text-xs font-bold text-[#4B3CE4]">*</p>
				</div>
				<input
					id="quoteNumber"
					type="text"
					name="quoteNumber"
					placeholder={`2025-0000`}
					className="w-full p-2 border rounded-lg text-gray-800"
					onChange={handleFieldChange}
					value={formData.quoteNumber}
				/>
			</div>

			<div className="space-y-4">
				{prestations.map((prestation, index) => (
					<div
						key={index}
						className={`px-4 rounded-xl space-y-2 transition-all duration-500 bg-[#F6F6F6] ${
							adding && index === prestations.length - 1
								? 'transform scale-95 opacity-0'
								: 'transform scale-100 opacity-100'
						} ${
							removingIndex === index
								? 'transform scale-95 opacity-0'
								: 'transform scale-100 opacity-100'
						}`}
					>
						<div className="flex justify-between items-center">
							<div className="flex items-center">
								<p className="font-bold text-gray-800 text-lg mr-2">
									Prestation n°{index + 1}
								</p>
								<button
									type="button"
									className="p-2 text-blue-600"
									onClick={() => toggleExpand(index)}
								>
									<i
										className={`fas ${
											expanded[index]
												? 'fa-chevron-up'
												: 'fa-chevron-down'
										}`}
									></i>
								</button>
							</div>
							<button
								type="button"
								className="p-2 text-red-600"
								onClick={() => removePrestation(index)}
							>
								<i className="fas fa-trash"></i>
							</button>
						</div>
						<div
							className={`${
								expanded[index]
									? 'max-h-screen opacity-100 pb-3'
									: 'max-h-0 opacity-0 pb-0'
							} overflow-hidden transition-all duration-500 ease-in-out`}
						>
							<div className="flex gap-1 flex-col">
								<div className="flex gap-1">
									<label className="font-medium text-xs text-gray-700 block">
										Titre de la prestation
									</label>
									<p className="text-xs font-bold text-[#4B3CE4]">
										*
									</p>
								</div>
								<input
									type="text"
									name="title"
									placeholder="Maquette web"
									className="w-full p-2 border rounded-lg text-gray-800"
									onChange={(e) =>
										handlePrestationChange(index, e)
									}
									value={prestation.title || ''}
								/>
							</div>
							<div className="flex gap-1 flex-col">
								<div className="flex gap-1">
									<label className="font-medium text-xs text-gray-700 block">
										Description de la prestation
									</label>
									<p className="text-xs font-bold text-[#4B3CE4]">
										*
									</p>
								</div>
								<textarea
									name="description"
									placeholder="Nous voulons un site internet..."
									className="w-full p-2 border rounded-lg text-gray-800"
									onChange={(e) =>
										handlePrestationChange(index, e)
									}
									value={prestation.description || ''}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="flex gap-1 flex-col">
									<div className="flex gap-1">
										<label className="font-medium text-xs text-gray-700 block">
											Prix
										</label>
										<p className="text-xs font-bold text-[#4B3CE4]">
											*
										</p>
									</div>
									<input
										type="text"
										name="price"
										placeholder="200,00"
										className="w-full p-2 border rounded-lg text-gray-800"
										onChange={(e) =>
											handlePrestationChange(index, e)
										}
										value={
											Number.isNaN(prestation.price)
												? ''
												: prestation.price
										}
									/>
								</div>
								<div className="flex gap-1 flex-col">
									<div className="flex gap-1">
										<label className="font-medium text-xs text-gray-700 block">
											Quantité
										</label>
										<p className="text-xs font-bold text-[#4B3CE4]">
											*
										</p>
									</div>
									<input
										type="text"
										name="quantity"
										placeholder="Quantité"
										className="w-full p-2 border rounded-lg text-gray-800"
										onChange={(e) =>
											handlePrestationChange(index, e)
										}
										value={
											Number.isNaN(prestation.quantity)
												? ''
												: prestation.quantity
										}
									/>
								</div>
							</div>
						</div>
					</div>
				))}
				<div className="flex gap-2">
					<button
						type="button"
						className="bg-transparent text-gray-800 px-4 py-2 rounded border"
						onClick={addPrestation}
					>
						Ajouter une prestation
					</button>
					<button
						type="button"
						className="bg-red-600 text-white px-4 py-2 rounded border"
						onClick={confirmAndRemoveAllPrestations}
					>
						Supprimer toutes les prestations
					</button>
				</div>
			</div>
		</>
	);
};

export default DocForm;
