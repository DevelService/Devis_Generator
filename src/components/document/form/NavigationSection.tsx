'use client';

import LINK from 'next/link';
import { Data } from '@/interfaces/document';

interface NavigationSectionProps {
	data: Data;
	handleSwitchChangeDocument: (
		event: React.ChangeEvent<HTMLInputElement>
	) => void;
}

export default function NavigationSection({
	data,
	handleSwitchChangeDocument,
}: NavigationSectionProps) {
	return (
		<section className="flex flex-raw">
			<LINK
				href="/"
				className="text-[#3F3F46] text-lg box-border flex flex-row items-center justify-center p-1.5 gap-1.5 min-w-48 max-w-48 h-9 bg-gray-100 border border-gray-300 shadow-sm rounded-md"
			>
				&lt; Revenir en arrière
			</LINK>
			<div className="w-full flex justify-end">
				<div className="flex flex-col justify-end gap-2 p-2 bg-gray-50 border border-gray-300 shadow-sm rounded-md">
					<div className="flex flex-row w-full items-center justify-end gap-2">
						<i
							className={`fa fa-file-text transition-colors duration-300 ${
								data.documentType === 'facture'
									? 'text-gray-400'
									: 'text-gray-600'
							}`}
						></i>
						<label className="flex h-4 w-12 cursor-pointer items-center rounded-full bg-gray-300 transition has-[:checked]:bg-gray-600">
							<input
								className="peer sr-only"
								id="switch-document"
								type="checkbox"
								onChange={handleSwitchChangeDocument}
							/>
							<span className="m-1 flex h-2 w-2 items-center justify-center rounded-full bg-gray-300 ring-[2px] ring-inset ring-white transition-all peer-checked:translate-x-8 peer-checked:bg-white peer-checked:ring-transparent"></span>
						</label>
						<i
							className={`fa fa-file transition-colors duration-300 ${
								data.documentType === 'facture'
									? 'text-gray-600'
									: 'text-gray-400'
							}`}
						></i>
					</div>
				</div>
			</div>
		</section>
	);
}
