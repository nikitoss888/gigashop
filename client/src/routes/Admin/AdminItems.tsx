import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/Items/List";
import { Item } from "../../mock/Items";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { GetItems } from "../index";

export default function AdminItems() {
	document.title = "Товари - Адміністративна панель - gigashop";

	const { data, totalCount, initPage, initLimit, initSortBy } = useLoaderData() as {
		data: Item[];
		totalCount: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
	};

	const [sortBy, setSortBy] = useState(initSortBy || "releaseDateAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const [items, setItems] = useState(data);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getItems = (sortBy: string, limit: number, page: number) => {
		const { data, totalCount } = GetItems({ admin: true, sortBy, limit, page });
		setItems(data);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getItems(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getItems(sortBy, limit, 1);
		setPage(1);
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
