import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/Items/List";
import Items, { Item } from "../../mock/Items";
import { useEffect, useState } from "react";
import ListItem from "../../components/Admin/Items/ListItem";

const SortSwitch = (sortBy: string, a: Item, b: Item) => {
	switch (sortBy) {
		case "nameDesc":
			return b.name.localeCompare(a.name);
		case "nameAsc":
			return a.name.localeCompare(b.name);
		case "priceDesc":
			return b.price - a.price;
		case "priceAsc":
			return a.price - b.price;
		case "releaseDateDesc":
			return b.releaseDate.getTime() - a.releaseDate.getTime();
		case "releaseDateAsc":
		default:
			return a.releaseDate.getTime() - b.releaseDate.getTime();
	}
};

export default function AdminItems() {
	document.title = "Товари - Адміністративна панель - gigashop";

	const [sortBy, setSortBy] = useState("releaseDateAsc");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const [items, setItems] = useState(
		Items.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit)
	);
	const [maxPage, setMaxPage] = useState(Math.ceil(Items.length / limit) || 1);

	const getItems = (refresh?: boolean) => {
		const localPage = refresh ? 1 : page;
		const items = Items.sort((a, b) => SortSwitch(sortBy, a, b)).slice((localPage - 1) * limit, localPage * limit);
		setItems(items);
		refresh && setMaxPage(Math.ceil(Items.length / limit) || 1);
	};

	useEffect(() => {
		setPage(1);
		getItems(true);
	}, [sortBy, limit]);

	useEffect(() => {
		getItems();
	}, [page]);

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список товарів
			</Typography>
			<List
				items={items}
				sorting={{
					value: sortBy,
					setValue: setSortBy,
				}}
				limitation={{
					value: limit,
					setValue: setLimit,
				}}
				pagination={{
					value: page,
					setValue: setPage,
					maxValue: maxPage,
				}}
			>
				{items?.map((item) => (
					<ListItem key={item.id.toString(16)} item={item} />
				))}
			</List>
		</Box>
	);
}
