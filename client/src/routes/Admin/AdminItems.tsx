import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/Items/List";
import { DeleteItemRequest, Item } from "../../http/Items";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { GetItems } from "../index";
import ClientError from "../../ClientError";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

export default function AdminItems() {
	document.title = "Товари - Адміністративна панель - gigashop";

	const { data, totalCount, initPage, initLimit, initSortBy, error } = useLoaderData() as {
		data?: Item[];
		totalCount?: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
		error?: ClientError;
	};
	if (error) throw error;

	const [sortBy, setSortBy] = useState(initSortBy || "releaseDateAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const [items, setItems] = useState(data || []);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getItems = async (sortBy: string, limit: number, page: number) => {
		const { data, totalCount, error } = await GetItems({ admin: true, sortBy, limit, page });
		if (error) throw error;
		setItems(data);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = async (sortBy: string) => {
		await getItems(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = async (limit: number) => {
		await getItems(sortBy, limit, 1);
		setPage(1);
		setLimit(limit);
	};

	const pageUpdate = async (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		await getItems(sortBy, limit, localPage);
		setPage(localPage);
	};

	const onDelete = async (id: number) => {
		const token = Cookies.get("token");
		if (!token) throw new ClientError(401, "Необхідно авторизуватися");

		const result = await DeleteItemRequest(token, id).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) throw result;

		if (result) await getItems(sortBy, limit, page);
	};

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список товарів
			</Typography>
			<List
				items={items}
				onDelete={onDelete}
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
