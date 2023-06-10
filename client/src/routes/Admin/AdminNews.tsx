import { useState } from "react";
import { Publication } from "../../mock/Publications";
import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/News/List";
import { useLoaderData } from "react-router-dom";
import { GetPublications } from "../index";

export default function AdminNews() {
	document.title = "Новини - Адміністративна панель - gigashop";

	const { data, totalCount, initPage, initLimit, initSortBy } = useLoaderData() as {
		data: Publication[];
		totalCount: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
	};

	const [sortBy, setSortBy] = useState(initSortBy || "createdAtAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const [news, setNews] = useState(data);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getNews = (sortBy: string, limit: number, page: number) => {
		const { data, totalCount } = GetPublications({ admin: true, sortBy, limit, page });
		setNews(data);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getNews(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getNews(sortBy, limit, page);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getNews(sortBy, limit, localPage);
		setPage(localPage);
	};

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список публікацій
			</Typography>
			<List
				news={news}
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
