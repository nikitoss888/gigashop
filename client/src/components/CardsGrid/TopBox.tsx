import { ReactNode } from "react";
import styled from "@mui/material/styles/styled";
import { Box } from "@mui/material";

const TopBoxStyle = styled(Box)`
	display: grid;
	grid-template-rows: repeat(auto-fit, 1fr);
	gap: 10px;
` as typeof Box;

export default function TopBox({ children }: { children: ReactNode }) {
	return (
		<TopBoxStyle
			sx={{
				gridTemplateColumns: {
					xs: "1fr",
					sm: "repeat(auto-fit, minmax(100px, 1fr))",
				},
			}}
		>
			{children}
		</TopBoxStyle>
	);
}
