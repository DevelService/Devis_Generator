// validateForm.ts
export const validateForm = (
	formData: any,
	setIsFormValid: (isValid: boolean) => void
) => {
	const fieldsToValidate = [
		'company',
		'address',
		'quoteNumber',
		'vat',
		'additionalInfo',
	];
	let allValid = true;

	fieldsToValidate.forEach((fieldId) => {
		const value = (formData as any)[fieldId];
		let isValid = true;
		switch (fieldId) {
			case 'vat':
				isValid = /^[A-Z0-9]{2,12}$/.test(value);
				break;
			case 'siren':
				isValid = /^[0-9]{9}$/.test(value);
				break;
			case 'quoteNumber':
				isValid = /^[0-9]{4}-[0-9]{4}$/.test(value);
				break;
			case 'vat':
				isValid =
					/^[0-9]{1,3}$/.test(value) &&
					parseInt(value) >= 0 &&
					parseInt(value) <= 100;
				break;
			default:
				isValid = !!value;
		}
		const field = document.getElementById(fieldId);
		if (!isValid) {
			if (field) field.classList.add('border-red-600');
			allValid = false;
		} else {
			if (field) field.classList.remove('border-red-600');
		}
	});

	setIsFormValid(allValid);
};
