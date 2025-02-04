import React from 'react';

interface InfoFormProps {
	formData: any;

	handleFieldChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
}

const InfoForm: React.FC<InfoFormProps> = ({ formData, handleFieldChange }) => {
	return (
		<>
			<p className="text-base font-bold mb-4 text-gray-800">
				Informations complémentaires
			</p>
			<div className="flex gap-1 flex-col">
				<div className="flex gap-1">
					<label className="font-medium text-xs text-gray-700 block">
						TVA Applicable
					</label>
					<p className="text-xs font-bold text-[#4B3CE4]">*</p>
				</div>
				<input
					id="vat"
					type="number"
					name="vat"
					placeholder="TVA (%)"
					className="w-full p-2 border rounded-lg text-gray-800"
					onChange={handleFieldChange}
					value={formData.vat}
					min={-100}
					max={100}
				/>
			</div>
			<div className="flex gap-1 flex-col">
				<div className="flex gap-1">
					<label className="font-medium text-xs text-gray-700 block">
						Informations
					</label>
					<p className="text-xs font-bold text-[#4B3CE4]">*</p>
				</div>
				<textarea
					id="additionalInfo"
					name="additionalInfo"
					placeholder="Un acompte de 50 % est demandé dès la validation du devis. Le solde restant sera dû à la livraison."
					className="w-full h-52 p-2 border rounded-lg text-gray-800"
					onChange={handleFieldChange}
					value={formData.additionalInfo}
				/>
			</div>
		</>
	);
};

export default InfoForm;
