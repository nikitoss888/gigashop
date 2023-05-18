import styled from "@emotion/styled";
import ItemCard from "./ItemCard";
import Items from "../../mock/Items";

const Grid = styled.div`
	grid-area: items;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	grid-template-rows: repeat(auto-fill, minmax(250px, 1fr));
	grid-auto-flow: dense;
	grid-gap: 20px;
`;

export default function ItemsGrid() {
	const items = Items;
	return (
		<Grid>
			{items.map((item) => (
				<ItemCard key={item.id} item={item} />
			))}
		</Grid>
	);
}
