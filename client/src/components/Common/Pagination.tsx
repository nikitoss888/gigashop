import { Box, Pagination as MuiPagination, SxProps } from "@mui/material";
import styled from "@mui/material/styles/styled";
import { useTheme } from "@mui/material/styles";

type PaginationProps = {
	data: {
		value: number;
		setValue: (page: number) => void;
		maxValue: number;
	};
	sx?: SxProps;
};

const PaginationBox = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;
`;
export default function Pagination({ data, sx }: PaginationProps) {
	const theme = useTheme();
	return (
		<PaginationBox sx={sx}>
			<MuiPagination
				count={data.maxValue}
				page={data.value}
				onChange={(_, page) => page <= data.maxValue && page >= 1 && page !== data.value && data.setValue(page)}
				sx={{
					color: "secondary.main",
					"& .Mui-selected": {
						backgroundColor: theme.colors.accent,
						"&:hover": {
							backgroundColor: theme.colors.accent,
						},
					},
				}}
			/>
		</PaginationBox>
	);
}
