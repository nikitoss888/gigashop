import styled from "@emotion/styled";
import ItemCard from "./ItemCard";
import Items from "../../mock/Items";
import { Box } from "@mui/material";

const Grid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	grid-template-rows: repeat(auto-fill, 1fr);
	grid-auto-flow: dense;
	grid-gap: 20px;
`;

export default function ItemsGrid() {
	const items = Items;
	return (
		<Grid sx={{ gridRow: { sm: "3", md: "2" } }}>
			{items.map((item) => (
				<ItemCard key={item.id.toString(16)} item={item} />
			))}
		</Grid>
	);
}
