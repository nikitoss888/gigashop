declare global {
	interface Window {
		cloudinary: any;
	}
}

window.cloudinary = window.cloudinary || {};
