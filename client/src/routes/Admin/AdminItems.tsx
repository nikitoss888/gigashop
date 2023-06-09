import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/Items/List";
import Items, { Item } from "../../mock/Items";
import { useState } from "react";
import { SortSwitch } from "../Items";
import { useLoaderData } from "react-router-dom";

export default function AdminItems() {
	document.title = "Товари - Адміністративна панель - gigashop";

	const [sortBy, setSortBy] = useState("releaseDateAsc");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const { data, totalCount } = useLoaderData() as {
		data: Item[];
		totalCount: number;
	};

	const [items, setItems] = useState(
		data?.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit) || []
	);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 0) / limit) || 1);

	const getItems = (sortBy: string, limit: number, page: number) => {
		const items = Items.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit);
		setItems(items);
		setMaxPage(Math.ceil(Items.length / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getItems(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getItems(sortBy, limit, page);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getItems(sortBy, limit, localPage);
		setPage(localPage);
	};

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список товарів
			</Typography>
			<List
				items={items}
				sorting={{
					value: sortBy,
					setValue: sortByUpdate,
				}}
				limitation={{
					value: limit,
					setValue: limitUpdate,
				}}
				pagination={{
					value: page,
					setValue: pageUpdate,
					maxValue: maxPage,
				}}
			/>
		</Box>
	);
}
