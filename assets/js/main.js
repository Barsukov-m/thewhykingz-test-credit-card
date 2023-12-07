(function($) {
	const validateCardNumber = (number) => /^\d{4} \d{4} \d{4} \d{4}$/.test(number);

	const validateCardHolder = (name) => /^[a-zA-Z ]+$/.test(name.trim()) && name.trim().length > 0;

	const validateExpirationDate = (month, year) => {
		const currentYear = new Date().getFullYear() % 100;
		const currentMonth = new Date().getMonth() + 1;
		return !(year == currentYear && month < currentMonth);
	}

	const validateCardCvv = (cvv) => /^\d{3}$/.test(cvv.trim());

	const validateInput = (input, validator) => {
		const isValid = validator(input.val());
		input.toggleClass('error', !isValid);
		return isValid;
	}

	const appendExpirationYears = () => {
		const cardYear = $('#card-year');
		const currentYear = new Date().getFullYear() % 100;

		for (let i = 0; i <= 10; i++) {
			cardYear.append(`<option value="${currentYear + i}">${currentYear + i}</option>`)
		}
	}

	const setCardData = () => {
		cardNumber.text(validateCardNumber(cardNumberInput.val()) ? cardNumberInput.val() : 'XXXX XXXX XXXX XXXX');
		cardHolder.text(validateCardHolder(cardHolderInput.val()) ? cardHolderInput.val().trim() : 'Full name');

		if (validateExpirationDate(parseInt(cardMonthInput.val(), 10), parseInt(cardYearInput.val(), 10))) {
			cardMonth.text(cardMonthInput.val() || 'MM');
			cardYear.text(cardYearInput.val() || 'YY');
		} else {
			cardMonth.text('MM');
			cardYear.text('YY');
		}
	}

	const alertFormData = (number, holder, month, year) => {
		let output = `Card number: ${number}\n`
		output += `Card holder: ${holder}\n`;
		output += `Expiration date: ${month} / ${year}`;

		alert(output);
	}

	const parseFormData = (e) => {
		e.preventDefault();

		let isFormValid = true;

		isFormValid = validateInput(cardNumberInput, validateCardNumber) && isFormValid;
		isFormValid = validateInput(cardHolderInput, validateCardHolder) && isFormValid;
		isFormValid = validateInput(cardMonthInput, () => validateExpirationDate(parseInt(cardMonthInput.val(), 10), parseInt(cardYearInput.val(), 10))) && isFormValid;
		isFormValid = validateInput(cardYearInput, () => validateExpirationDate(parseInt(cardMonthInput.val(), 10), parseInt(cardYearInput.val(), 10))) && isFormValid;
		isFormValid = validateInput(cardCvvInput, validateCardCvv) && isFormValid;

		if (!isFormValid) return;
	
		alertFormData(cardNumberInput.val(), cardHolderInput.val(), cardMonthInput.val(), cardYearInput.val());
	}

	const cardForm = $('.card-form__wr');
	const cardNumber = $('.credit-card__number');
	const cardNumberInput = $('#card-number');
	const cardHolder = $('.credit-card__name');
	const cardHolderInput = $('#card-holder');
	const cardMonth = $('.credit-card__month');
	const cardMonthInput = $('#card-month');
	const cardYear = $('.credit-card__year');
	const cardYearInput = $('#card-year');
	const cardCvvInput = $('#card-cvv');
	const submitBtn = $('.card-form__submit');

	$(document).ready(function() {
		appendExpirationYears();

		cardForm.on('change', setCardData);

		cardForm.on('submit', parseFormData);

		cardNumberInput.on('input', function() {
			this.value = this.value.replace(/\D/g, '').replace(/(\d{4}(?!\s))/g, "$1 ");
			if (this.value.length && this.value[this.value.length - 1] === ' ') {
				this.value = this.value.slice(0, -1);
			}

			validateInput($(this), validateCardNumber);
		});

		cardHolderInput.on('input', function() {
			validateInput($(this), validateCardHolder);
		});

		cardMonthInput.add(cardYearInput).on('change', function() {
			validateInput(cardMonthInput, () => validateExpirationDate(parseInt(cardMonthInput.val(), 10), parseInt(cardYearInput.val(), 10)));
			validateInput(cardYearInput, () => validateExpirationDate(parseInt(cardMonthInput.val(), 10), parseInt(cardYearInput.val(), 10)));
		});

		cardCvvInput.on('input', function() {
			this.value = this.value.replace(/\D/g, '').substring(0, 3);
			validateInput($(this), validateCardCvv);
		});
	});
})(jQuery);
