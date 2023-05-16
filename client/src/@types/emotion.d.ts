import "@emotion/react";
import { Theme as BaseTheme } from "../theme";

declare module "@emotion/react" {
	export interface Theme extends BaseTheme {
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
		palette: {
			inputs: {
				background?: string;
				placeholder?: string;
			};
		};
	}
}
