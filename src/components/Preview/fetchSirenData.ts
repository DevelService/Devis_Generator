// fetchSirenData.ts
export const fetchSirenData = async (
	siren: string,
	formData: any,
	setSirenData: (data: any) => void,
	setCanDownload: (canDownload: boolean) => void,
	generatePDF: (
		formData: any,
		setPdfUrl: (url: string | null) => void
	) => void,
	setPdfUrl: (url: string | null) => void
) => {
	try {
		const response = await fetch(`/api/fetchSirenData?siren=${siren}`);
		const sirenInput = document.getElementById('siren');
		const companyInput = document.getElementById('company');

		if (!response.ok) {
			console.warn('Network response was not ok, using fallback data');
			if (sirenInput) {
				sirenInput.classList.add('border-red-600');
			}
			if (companyInput) {
				(companyInput as HTMLInputElement).value = '';
				formData.company = '';
			}
			setCanDownload(false);
		} else {
			const data = await response.json();
			console.log(data);
			setSirenData(data);
			if (sirenInput && sirenInput.classList.contains('border-red-600')) {
				sirenInput.classList.remove('border-red-600');
			}
			if (companyInput) {
				(companyInput as HTMLInputElement).value =
					data.uniteLegale.periodesUniteLegale[0].denominationUniteLegale;
				formData.company =
					data.uniteLegale.periodesUniteLegale[0].denominationUniteLegale;
				companyInput.classList.remove('border-red-600');
				generatePDF(formData, setPdfUrl);
			}
			setCanDownload(true);
		}
	} catch (error) {
		console.error('Error fetching data:', error);
		const sirenInput = document.getElementById('siren');
		const companyInput = document.getElementById('company');
		if (sirenInput) {
			sirenInput.classList.add('border-red-600');
		}
		if (companyInput) {
			(companyInput as HTMLInputElement).value = '';
			formData.company = '';
		}
		setCanDownload(false);
	}
};
