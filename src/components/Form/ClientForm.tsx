import React from 'react';

interface ClientFormProps {
	formData: any;

	handleFieldChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({
	formData,
	handleFieldChange,
}) => {
	return (
		<>
			<p className="text-base font-bold mb-4 text-gray-800">Le client</p>
			<div className="grid grid-cols-2 gap-4">
				<div className="flex gap-1 flex-col">
					<div className="flex gap-1">
						<label className="font-medium text-xs text-gray-700 block">
							Siren
						</label>
						<p className="text-xs font-bold text-[#4B3CE4]"></p>
					</div>
					<input
						id="siren"
						type="text"
						name="siren"
						placeholder="SIREN"
						className="w-full p-2 border rounded-lg text-gray-800"
						onChange={handleFieldChange}
						value={formData.siren}
					/>
				</div>
				<div className="flex gap-1 flex-col">
					<div className="flex gap-1">
						<label className="font-medium text-xs text-gray-700 block">
							Raison sociale
						</label>
						<p className="text-xs font-bold text-[#4B3CE4]">*</p>
					</div>
					<input
						id="company"
						type="text"
						name="company"
						placeholder="Nom de l'entreprise"
						className="w-full p-2 border rounded-lg text-gray-800"
						onChange={handleFieldChange}
						value={formData.company}
					/>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div className="flex gap-1 flex-col">
					<div className="flex gap-1">
						<label className="font-medium text-xs text-gray-700 block">
							Adresse mail
						</label>
						<p className="text-xs font-bold text-[#4B3CE4]"></p>
					</div>
					<div className="relative">
						<span className="absolute inset-y-0 left-0 flex items-center pl-2">
							<i className="fas fa-envelope text-[#A1A1AA]"></i>
						</span>
						<input
							id="email"
							type="email"
							name="email"
							placeholder="john.smith@example.com"
							className="w-full p-2 pl-8 border rounded-lg text-gray-800"
							onChange={handleFieldChange}
							value={formData.email}
						/>
					</div>
				</div>
				<div className="flex gap-1 flex-col">
					<div className="flex gap-1">
						<label className="font-medium text-xs text-gray-700 block">
							Téléphone
						</label>
						<p className="text-xs font-bold text-[#4B3CE4]"></p>
					</div>
					<div className="relative">
						<span className="absolute inset-y-0 left-0 flex items-center pl-2">
							<i className="fas fa-phone text-[#A1A1AA]"></i>
						</span>
						<input
							id="phone"
							type="text"
							name="phone"
							placeholder="01 23 45 67 89"
							className="w-full p-2 pl-8 border rounded-lg text-gray-800"
							onChange={handleFieldChange}
							value={formData.phone}
						/>
					</div>
				</div>
			</div>
			<div className="flex gap-1 flex-col">
				<div className="flex gap-1">
					<label className="font-medium text-xs text-gray-700 block">
						Adresse complète
					</label>
					<p className="text-xs font-bold text-[#4B3CE4]">*</p>
				</div>
				<input
					id="address"
					type="text"
					name="address"
					placeholder="1 Av. Gustave Eiffel, 75007 Paris"
					className="w-full p-2 border rounded-lg text-gray-800"
					onChange={handleFieldChange}
					value={formData.address}
				/>
			</div>
		</>
	);
};

export default ClientForm;
