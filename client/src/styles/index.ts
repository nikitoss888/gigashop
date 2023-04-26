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

const BaseTheme = {
	fonts: {
		body: "Roboto, sans-serif",
		heading: "Roboto, sans-serif",
	},
	colors: {
		inputPlaceholder: InputPlaceholder,
		inputBackground: InputBackground,
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
