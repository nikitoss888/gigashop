import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/ItemsComments/List";
import { ItemRate } from "../../http/Items";
import { GetItemsRates } from "../index";
import { User } from "../../http/User";
import ClientError from "../../ClientError";
import { AxiosError } from "axios";

const SortSwitch = (sortBy: string) => {
	switch (sortBy) {
		case "createdAtDesc":
			return { descending: true };
		case "createdAtAsc":
		default:
			return { descending: false };
	}
};

export default function AdminItemsRates() {
	document.title = "Оцінки до товарів - Адміністративна панель - gigashop";

	const { data, totalCount, initPage, initLimit, initSortBy, error } = useLoaderData() as {
		data?: (ItemRate & {
			User: User;
		})[];
		totalCount?: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
		error?: ClientError;
	};

	if (error) throw error;

	const [sortBy, setSortBy] = useState(initSortBy || "createdAtAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const [comments, setComments] = useState(data || []);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getComments = async (sortBy: string, limit: number, page: number) => {
		const result = await GetItemsRates({ sortBy, limit, page }).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) throw result;

		const { data, totalCount } = result;
		if (!data) throw new ClientError(500, "Помилка сервера");

		setComments(data);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = async (sortBy: string) => {
		await getComments(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = async (limit: number) => {
		await getComments(sortBy, limit, 1);
		setPage(1);
		setLimit(limit);
	};

	const pageUpdate = async (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		await getComments(sortBy, limit, localPage);
		setPage(localPage);
	};

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список коментарів
			</Typography>
			<List
				rates={comments}
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
