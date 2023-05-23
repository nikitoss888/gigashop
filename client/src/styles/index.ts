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

const BodyFont = "Merriweather, sans-serif";
const HeadingFont = "Montserrat Alternates, serif";

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
		},
		h2: {
			fontFamily: HeadingFont,
		},
		h3: {
			fontFamily: HeadingFont,
		},
		h4: {
			fontFamily: HeadingFont,
		},
		h5: {
			fontFamily: HeadingFont,
		},
		h6: {
			fontFamily: HeadingFont,
		},
		subtitle1: {
			fontFamily: BodyFont,
		},
		subtitle2: {
			fontFamily: BodyFont,
		},
		body1: {
			fontFamily: BodyFont,
		},
		body2: {
			fontFamily: BodyFont,
		},
		caption: {
			fontFamily: BodyFont,
		},
		button: {
			fontFamily: BodyFont,
		},
		overline: {
			fontFamily: BodyFont,
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
