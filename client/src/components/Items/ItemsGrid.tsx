import ItemCard from "./ItemCard";
import { Item } from "../../mock/Items";
import { SxProps } from "@mui/material";
import Grid from "../CardsGrid/Grid";
import NotFoundBox from "../CardsGrid/NotFoundBox";

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
			{items.length === 0 && <NotFoundBox text={"Товари не знайдено"} />}
		</Grid>
	);
}
