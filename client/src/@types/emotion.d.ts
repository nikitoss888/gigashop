import "@emotion/react";

declare module "@emotion/react" {
	export interface Theme {
		fonts: {
			body?: string;
			heading?: string;
		};
		colors: {
			primary?: string;
			secondary?: string;
			accent?: string;
			accentLight?: string;
			accentLighter?: string;
			inputPlaceholder?: string;
			inputBackground?: string;
		};
	}
}
