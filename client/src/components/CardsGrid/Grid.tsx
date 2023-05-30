import styled from "@emotion/styled";
import { Box, SxProps } from "@mui/material";
import { ReactNode } from "react";

const Grid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	grid-template-rows: repeat(auto-fill, 1fr);
	grid-auto-flow: dense;
	grid-gap: 15px;
`;

type GridProps = {
	sx?: SxProps;
	children?: ReactNode;
};
export default function ItemsGrid({ sx, children }: GridProps) {
	return <Grid sx={sx}>{children}</Grid>;
}
