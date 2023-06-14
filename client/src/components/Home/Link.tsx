import { ReactNode } from "react";
import { SxProps, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

type ContentBoxProps = {
	children: ReactNode;
	to: string;
	sx?: SxProps;
};
export default function Link({ children, sx, to }: ContentBoxProps) {
	return (
		<Typography
			component={RouterLink}
			variant='h6'
			to={to}
			sx={{
				...sx,
				textDecoration: "none",
				color: "accent.main",
				"&:hover": {
					textDecoration: "underline",
				},
			}}
		>
			{children}
		</Typography>
	);
}
