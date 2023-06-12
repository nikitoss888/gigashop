import { useState } from "react";
import { DeletePublicationRequest, Publication } from "../../http/Publications";
import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/News/List";
import { useLoaderData } from "react-router-dom";
import { GetPublications } from "../index";
import { User } from "../../http/User";
import ClientError from "../../ClientError";
import Cookies from "js-cookie";

export default function AdminNews() {
	document.title = "Новини - Адміністративна панель - gigashop";

	const { data, totalCount, initPage, initLimit, initSortBy, error } = useLoaderData() as {
		data?: (Publication & { AuthoredUser: User })[];
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

	const [news, setNews] = useState(data || []);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getNews = async (sortBy: string, limit: number, page: number) => {
		const { data, totalCount, error } = await GetPublications({ admin: true, sortBy, limit, page });

		if (error) throw error;

		setNews(data || []);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = async (sortBy: string) => {
		await getNews(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = async (limit: number) => {
		await getNews(sortBy, limit, page);
		setLimit(limit);
	};

	const pageUpdate = async (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		await getNews(sortBy, limit, localPage);
		setPage(localPage);
	};

	const onDelete = async (id: number) => {
		const publication = news.find((item) => item.id === id);
		if (!publication) throw new ClientError(404, "Публікація не знайдена");
		if (publication.AuthoredUser.role.toLowerCase() === "user")
			throw new ClientError(403, "Заборонено видаляти публікації користувачів");

		const token = Cookies.get("token");
		if (!token) throw new ClientError(401, "Необхідно авторизуватися");

		const result = await DeletePublicationRequest(token, id).catch((error) => {
			if (error instanceof ClientError) return error;
			return new ClientError(500, "Не вдалося видалити публікацію");
		});
		if (result instanceof ClientError) throw result;

		if (result) await getNews(sortBy, limit, page);
	};

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список публікацій
			</Typography>
			<List
				news={news}
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
