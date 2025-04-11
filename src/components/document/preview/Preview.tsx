'use client';

import { useEffect, useRef, useState } from 'react';
import { generatePDF } from './generatePDF';
import { fetchSirenData } from './fetchSirenData';
import { renderPDFOnCanvas } from './renderPDFOnCanvas';
import { Data } from '@/interfaces/document';

interface PreviewProps {
	data: Data;
}

export default function Preview({ data }: PreviewProps) {
	console.log(data.documentType);
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
		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			generatePDF(data, setPdfUrl);
		}, 300);
		return () => {
			clearTimeout(timeoutRef.current);
			if (pdfUrl) {
				URL.revokeObjectURL(pdfUrl);
			}
		};
	}, [data]);

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
		if (
			data?.emetteur?.type === 'pro' &&
			'siren' in data.emetteur &&
			typeof data.emetteur.siren === 'string' &&
			data.emetteur.siren.length === 9
		) {
			fetchSirenData(
				data.emetteur.siren,
				data,
				setSirenData,
				setIsFormValid,
				setCanDownload,
				generatePDF,
				setPdfUrl
			);
		} else {
			setSirenData(null);
			setIsFormValid(false);
			setCanDownload(false);
		}
	}, [data?.emetteur]);	

	const downloadPDF = async () => {
		if (!isFormValid) {
			console.warn('Validation failed, not downloading PDF');
			return;
		}

		if (pdfUrl) {
			const link = document.createElement('a');
			link.href = pdfUrl;
			link.download = `${
				data.documentType === 'devis' ? 'D-' : 'F-'
			}${data.id}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	return (
		<div className="w-full h-screen md:w-2/3 flex flex-col items-center justify-center relative">
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
				{data.documentType === 'devis' ? 'le devis' : 'la facture'}
			</button>
		</div>
	);
}