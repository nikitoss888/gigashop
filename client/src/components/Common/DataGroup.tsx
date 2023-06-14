import { type ReactNode } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";

const ContentBox = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	flex-wrap: wrap;
	align-items: center;
	gap: 10px;
`;

type DataGroupProps = {
	title: string;
	column?: string;
	children?: ReactNode;
};

export default function DataGroup({ title, column, children }: DataGroupProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "start",
				gridColumn: {
					xs: 1,
					sm: column || "2",
				},
			}}
		>
			<Typography
				component='h6'
				variant='h6'
				pr={3}
				sx={{ fontWeight: "bold", borderBottom: "2px solid", borderColor: "primary.main" }}
			>
				{title}:
			</Typography>
			{children && <ContentBox sx={{ mt: 1 }}>{children}</ContentBox>}
		</Box>
	);
}
