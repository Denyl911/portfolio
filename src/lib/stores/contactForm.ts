import { gsap } from 'gsap';
import { writable } from 'svelte/store';

export interface FormData {
	name: string;
	email: string;
	message: string;
}

export interface Errors {
	name: string;
	email: string;
	message: string;
}

export interface ContactFormState {
	formData: FormData;
	errors: Errors;
	isSubmitting: boolean;
	formSubmitted: boolean;
	successMessage: string;
	errorMessage: string;
}

export interface ContactFormStore extends ContactFormState {
	updateField: (field: keyof FormData, value: string) => void;
	validateField: (field: keyof FormData, value: string) => string;
	validateAll: () => boolean;
	submitForm: (submitFn: (data: FormData) => Promise<void>) => Promise<void>;
	resetForm: () => void;
}

const initialState: ContactFormState = {
	formData: {
		name: '',
		email: '',
		message: '',
	},
	errors: {
		name: '',
		email: '',
		message: '',
	},
	isSubmitting: false,
	formSubmitted: false,
	successMessage: '',
	errorMessage: '',
};

function createContactFormStore() {
	const { subscribe, set, update } = writable(initialState);

	const validateName = (name: string): string => {
		if (!name.trim()) return 'Name is required';
		return '';
	};

	const validateEmail = (email: string): string => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email.trim()) return 'Email is required';
		if (!emailRegex.test(email)) return 'Invalid email format';
		return '';
	};

	const validateMessage = (message: string): string => {
		if (!message.trim()) return 'Message is required';
		if (message.trim().length < 10)
			return 'Message must be at least 10 characters';
		return '';
	};

	const validateField = (field: keyof FormData, value: string) => {
		let error = '';
		switch (field) {
			case 'name':
				error = validateName(value);
				break;
			case 'email':
				error = validateEmail(value);
				break;
			case 'message':
				error = validateMessage(value);
				break;
		}
		update((state) => ({
			...state,
			errors: { ...state.errors, [field]: error },
		}));
		return error;
	};

	const validateAll = (): boolean => {
		const state = getCurrentState();
		const nameError = validateName(state.formData.name);
		const emailError = validateEmail(state.formData.email);
		const messageError = validateMessage(state.formData.message);

		update((state) => ({
			...state,
			errors: {
				name: nameError,
				email: emailError,
				message: messageError,
			},
		}));

		return !nameError && !emailError && !messageError;
	};

	const updateField = (field: keyof FormData, value: string) => {
		update((state) => ({
			...state,
			formData: { ...state.formData, [field]: value },
		}));
		validateField(field, value);
	};

	const submitForm = async (submitFn: (data: FormData) => Promise<void>) => {
		if (!validateAll()) {
			// Animate errors
			gsap.fromTo(
				'.error-message',
				{ opacity: 0, y: -10 },
				{ opacity: 1, y: 0, duration: 0.3 },
			);
			return;
		}

		update((state) => ({ ...state, isSubmitting: true, errorMessage: '' }));

		try {
			await submitFn(getCurrentState().formData);
			update((state) => ({
				...state,
				formSubmitted: true,
				successMessage: 'Message sent successfully!',
				isSubmitting: false,
			}));
			// Animate success
			gsap.fromTo(
				'.success-message',
				{ opacity: 0, scale: 0.8 },
				{ opacity: 1, scale: 1, duration: 0.5 },
			);
		} catch (error: any) {
			update((state) => ({
				...state,
				errorMessage: error.error || error.message || 'Failed to send message',
				isSubmitting: false,
			}));
			// Animate error
			gsap.fromTo(
				'.error-banner',
				{ opacity: 0, x: -20 },
				{ opacity: 1, x: 0, duration: 0.3 },
			);
		}
	};

	const resetForm = () => {
		set(initialState);
	};

	const getCurrentState = (): ContactFormState => {
		let current: ContactFormState;
		subscribe((state) => {
			current = state;
		})();
		return current!;
	};

	return {
		subscribe,
		updateField,
		validateField,
		validateAll,
		submitForm,
		resetForm,
	};
}

export const contactFormStore = createContactFormStore();
