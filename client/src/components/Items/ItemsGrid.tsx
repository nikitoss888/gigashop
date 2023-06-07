import ItemCard from "./ItemCard";
import { Item } from "../../mock/Items";
import { Box, SxProps } from "@mui/material";
import Grid from "../CardsGrid/Grid";
import NotFoundBox from "../CardsGrid/NotFoundBox";
import Pagination from "../Common/Pagination";
import ItemsTopBox from "./ItemsTopBox";

type GridProps = {
	items: Item[];
	sx?: SxProps;
	sorting: {
		value: string;
		setValue: (sortBy: string) => void;
	};
	limitation: {
		value: number;
		setValue: (limit: number) => void;
	};
	pagination: {
		value: number;
		setValue: (page: number) => void;
		maxValue: number;
	};
};
export default function ItemsGrid({ items, sx, sorting, limitation, pagination }: GridProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "10px",
			}}
		>
			<ItemsTopBox sorting={sorting} limitation={limitation} />
			<Pagination data={pagination} />
			<Grid sx={sx}>
				{items.map((item) => (
					<ItemCard key={item.id.toString(16)} item={item} />
				))}
				{items.length === 0 && <NotFoundBox text={"Товари не знайдено"} />}
			</Grid>
			<Pagination data={pagination} sx={{ mt: "auto" }} />
		</Box>
	);
}
