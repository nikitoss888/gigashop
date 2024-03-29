import { createTheme } from "@mui/material";

const Black = "#272727";
const White = "#f0ead9";
const Orange = "#ef4722";
const OrangeLight = "#ef7d5f";
const OrangeLighter = "#efb39c";
const InputPlaceholder = "#505050";
const InputBackground = "#D9D9D9";
// const Error = "#ff0000";
// const Warning = "#ffbf00";
// const Info = "#00bfff";
// const Success = "#00ff00";

export const BodyFont = "Merriweather, sans-serif";
export const HeadingFont = "Montserrat Alternates, serif";

const BaseTheme = {
	fonts: {
		body: BodyFont,
		heading: HeadingFont,
	},
	colors: {
		inputPlaceholder: InputPlaceholder,
		inputBackground: InputBackground,
	},
	typography: {
		h1: {
			fontFamily: HeadingFont,
			color: Black,
		},
		h2: {
			fontFamily: HeadingFont,
			color: Black,
		},
		h3: {
			fontFamily: HeadingFont,
			color: Black,
		},
		h4: {
			fontFamily: HeadingFont,
			color: Black,
		},
		h5: {
			fontFamily: HeadingFont,
			color: Black,
		},
		h6: {
			fontFamily: HeadingFont,
			color: Black,
		},
		subtitle1: {
			fontFamily: BodyFont,
			color: Black,
		},
		subtitle2: {
			fontFamily: BodyFont,
			color: Black,
		},
		body1: {
			fontFamily: BodyFont,
			color: Black,
		},
		body2: {
			fontFamily: BodyFont,
			color: Black,
		},
		caption: {
			fontFamily: BodyFont,
			color: Black,
		},
		button: {
			fontFamily: BodyFont,
			color: Black,
		},
		overline: {
			fontFamily: BodyFont,
			color: Black,
		},
	},
};
export const RegularTheme = createTheme({
	...BaseTheme,
	palette: {
		primary: {
			main: Black,
			contrastText: White,
		},
		secondary: {
			main: White,
			contrastText: Black,
		},
		accent: {
			main: Orange,
			light: OrangeLight,
			lighter: OrangeLighter,
		},
		background: {
			default: White,
		},
		inputs: {
			background: InputBackground,
			color: InputPlaceholder,
		},
	},
	colors: {
		...BaseTheme.colors,
		primary: Black,
		secondary: White,
		accent: Orange,
		accentLight: OrangeLight,
		accentLighter: OrangeLighter,
	},
});
export const AdminTheme = RegularTheme;
