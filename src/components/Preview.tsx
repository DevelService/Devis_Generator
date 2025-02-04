// Preview.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { generatePDF } from './Preview/generatePDF';
import { validateForm } from './Preview/validateForm';
import { fetchSirenData } from './Preview/fetchSirenData';
import { renderPDFOnCanvas } from './Preview/renderPDFOnCanvas';
import { PreviewProps, Service } from './Preview/interfaces';

export default function Preview({ formData }: PreviewProps) {
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [isRendering, setIsRendering] = useState(false);
	const [isFormValid, setIsFormValid] = useState(true);
	const [canDownload, setCanDownload] = useState(true);
	const [sirenData, setSirenData] = useState<any>(null);
	const canvasRefs = useRef<HTMLCanvasElement[]>([]);
	const currentRenderTask = useRef<any>(null);
	const timeoutRef = useRef<any>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		validateForm(formData, setIsFormValid);
		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			generatePDF(formData, setPdfUrl);
		}, 300);
		return () => {
			clearTimeout(timeoutRef.current);
			if (pdfUrl) {
				URL.revokeObjectURL(pdfUrl);
			}
		};
	}, [formData]);

	useEffect(() => {
		if (pdfUrl) {
			setIsLoading(true);
			renderPDFOnCanvas(
				pdfUrl,
				canvasRefs,
				currentRenderTask,
				setIsRendering,
				setIsLoading
			);
		}
	}, [pdfUrl]);

	useEffect(() => {
		if (formData.siren.length === 9) {
			fetchSirenData(
				formData.siren,
				formData,
				setSirenData,
				setCanDownload,
				generatePDF,
				setPdfUrl
			);
		} else {
			const companyInput = document.getElementById('company');
			(companyInput as HTMLInputElement).value = '';
			formData.company = '';
		}
	}, [formData.siren]);

	const downloadPDF = async () => {
		if (!isFormValid) {
			console.warn('Validation failed, not downloading PDF');
			return;
		}

		if (pdfUrl) {
			const link = document.createElement('a');
			link.href = pdfUrl;
			link.download = `${
				formData.documentType === 'quote' ? 'D-' : 'F-'
			}${formData.quoteNumber}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	return (
		<div className="w-full md:w-2/3 flex flex-col items-center justify-center md:ml-[33.33%] relative">
			<button
				onClick={downloadPDF}
				className={`absolute top-0 right-0 m-4 px-4 py-2 bg-[#4B3CE4] text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ${
					!isFormValid || !canDownload
						? 'opacity-50 cursor-not-allowed'
						: ''
				}`}
				disabled={!isFormValid || !canDownload}
			>
				Télécharger{' '}
				{formData.documentType === 'quote' ? 'le devis' : 'la facture'}
			</button>
			<div className="bg-transparent flex flex-col shadow-xl rounded-xl w-full max-w-[600px] relative">
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
						<div className="loader"></div>
					</div>
				)}
				<div
					id="pdf-canvas-container"
					className="flex flex-col items-center w-full gap-4"
				></div>
			</div>
		</div>
	);
}
