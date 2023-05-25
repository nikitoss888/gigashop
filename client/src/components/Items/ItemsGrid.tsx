import styled from "@emotion/styled";
import ItemCard from "./ItemCard";
import { Item } from "../../mock/Items";
import { Box, SxProps } from "@mui/material";
import Typography from "@mui/material/Typography";

const Grid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	grid-template-rows: repeat(auto-fill, 1fr);
	grid-auto-flow: dense;
	grid-gap: 20px;
`;

type GridProps = {
	items: Item[];
	sx?: SxProps;
};
export default function ItemsGrid({ items, sx }: GridProps) {
	return (
		<Grid sx={sx}>
			{items.map((item) => (
				<ItemCard key={item.id.toString(16)} item={item} />
			))}
			{items.length === 0 && (
				<Box sx={{ gridColumn: "1 / -1" }}>
					<Typography variant='h5' textAlign='center'>
						Товари не знайдено
					</Typography>
				</Box>
			)}
		</Grid>
	);
}
