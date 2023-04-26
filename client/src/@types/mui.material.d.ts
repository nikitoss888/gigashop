import "@mui/material/styles";
import {
	PaletteColorOptions,
	Palette as BasePalette,
	PaletteOptions as BasePaletteOptions,
	SimplePaletteColorOptions as BaseSimplePaletteColorOptions,
	PropTypes as BasePropTypes,
} from "@mui/material";

declare module "@mui/material/styles" {
	export namespace PropTypes {
		type Color = BasePropTypes.Color | "accent" | "transparent";
	}
	interface Theme {
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
	// allow configuration using `createTheme`
	interface ThemeOptions {
		fonts?: {
			body?: string;
			heading?: string;
		};
		colors?: {
			primary?: string;
			secondary?: string;
			accent?: string;
			accentLight?: string;
			accentLighter?: string;
			inputPlaceholder?: string;
			inputBackground?: string;
		};
	}
	interface SimplePaletteColorOptions extends BaseSimplePaletteColorOptions {
		lighter?: string;
	}
	interface Palette extends BasePalette {
		accent?: PaletteColorOptions;
		inputs?: {
			background?: string;
			color?: string;
		};
	}
	interface PaletteOptions extends BasePaletteOptions {
		accent?: PaletteColorOptions;
		inputs?: {
			background?: string;
			color?: string;
		};
	}
}
