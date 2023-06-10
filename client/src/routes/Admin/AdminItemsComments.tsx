import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/ItemsComments/List";
import { ItemRate } from "../../mock/ItemsRates";
import { GetItemsRates } from "../index";

const SortSwitch = (sortBy: string) => {
	switch (sortBy) {
		case "createdAtDesc":
			return { descending: true };
		case "createdAtAsc":
		default:
			return { descending: false };
	}
};

export default function AdminNewsComments() {
	document.title = "Коментарі до товарів - Адміністративна панель - gigashop";

	const { data, totalCount, initPage, initLimit, initSortBy } = useLoaderData() as {
		data: ItemRate[];
		totalCount: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
	};

	const [sortBy, setSortBy] = useState(initSortBy || "createdAtAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const [comments, setComments] = useState(data);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getComments = (sortBy: string, limit: number, page: number) => {
		const { data, totalCount } = GetItemsRates({ sortBy, limit, page });
		setComments(data);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getComments(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getComments(sortBy, limit, 1);
		setPage(1);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getComments(sortBy, limit, localPage);
		setPage(localPage);
	};

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список коментарів
			</Typography>
			<List
				comments={comments}
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
				linkToItem
			/>
		</Box>
	);
}
export { SortSwitch };
