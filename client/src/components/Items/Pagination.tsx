import { Box, Pagination as MuiPagination, SxProps } from "@mui/material";
import styled from "@mui/material/styles/styled";

type PaginationProps = {
	data: {
		value: number;
		setValue: (page: number) => void;
		maxValue: number;
		recalculate?: () => void;
	};
	sx?: SxProps;
};

const PaginationBox = styled(Box)`
	display: flex;
	justify-content: center;
`;
export default function Pagination({ data, sx }: PaginationProps) {
	return (
		<PaginationBox sx={sx}>
			<MuiPagination
				count={data.maxValue}
				page={data.value}
				onChange={(_, page) => page <= data.maxValue && page >= 1 && page !== data.value && data.setValue(page)}
				sx={{
					"& .Mui-selected": {
						backgroundColor: "accent.main",
						"&:hover": {
							backgroundColor: "accent.main",
						},
					},
				}}
			/>
		</PaginationBox>
	);
}
