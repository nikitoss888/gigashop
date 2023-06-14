import styled from "@mui/material/styles/styled";
import { Box, SxProps } from "@mui/material";
import { ReactNode } from "react";

const BoxStyle = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 30px;
` as typeof Box;

type ContentBoxProps = {
	children: ReactNode;
	sx?: SxProps;
};
export default function ContentBox({ children, sx }: ContentBoxProps) {
	return (
		<BoxStyle
			sx={{
				...sx,
				flexDirection: {
					xs: "column",
					md: "row",
				},
			}}
		>
			{children}
		</BoxStyle>
	);
}
