import { useState } from "react";
import { DeleteGenreRequest, Genre } from "../../http/Genres";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import List from "../../components/Admin/Genres/List";
import { useLoaderData } from "react-router-dom";
import { GetGenres } from "../index";
import { Item } from "../../http/Items";
import ClientError from "../../ClientError";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

const SortSwitch = (sortBy: string) => {
	switch (sortBy) {
		case "nameDesc":
			return { descending: true };
		default:
		case "nameAsc":
			return { descending: false };
	}
};

export default function AdminGenre() {
	document.title = "Жанри - Адміністративна панель - gigashop";

	const { data, error, totalCount, initSortBy, initLimit, initPage } = useLoaderData() as {
		data?: (Genre & { Items: Item[] })[];
		totalCount?: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
		error?: ClientError;
	};
	if (error) throw error;

	const [sortBy, setSortBy] = useState(initSortBy || "nameAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const [genres, setGenres] = useState(data || []);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getGenres = async (sortBy: string, limit: number, page: number) => {
		const result = await GetGenres({ admin: true, sortBy, limit, page }).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});

		if (result instanceof ClientError) throw result;

		setGenres(result.data || []);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = async (sortBy: string) => {
		await getGenres(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = async (limit: number) => {
		await getGenres(sortBy, limit, 1);
		setPage(1);
		setLimit(limit);
	};

	const pageUpdate = async (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		await getGenres(sortBy, limit, localPage);
		setPage(localPage);
	};

	const onDelete = async (id: number) => {
		const token = Cookies.get("token");
		if (!token) throw new ClientError(403, "Необхідно авторизуватися");

		const result = await DeleteGenreRequest(token, id).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) throw result;

		if (result) await getGenres(sortBy, limit, page);
	};

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список жанрів
			</Typography>
			<List
				genres={genres}
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
export { SortSwitch };
