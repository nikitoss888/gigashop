import { useState } from "react";
import Publications, { Publication } from "../../mock/Publications";
import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/News/List";
import { SortSwitch } from "../NewsList";
import { useLoaderData } from "react-router-dom";

export default function AdminNews() {
	document.title = "Новини - Адміністративна панель - gigashop";

	const { data, totalCount } = useLoaderData() as {
		data: Publication[];
		totalCount: number;
	};

	const [sortBy, setSortBy] = useState("createdAtAsc");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const [news, setNews] = useState(
		data.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit)
	);
	const [maxPage, setMaxPage] = useState(Math.ceil(totalCount || 0 / limit) || 1);

	const getNews = (sortBy: string, limit: number, page: number) => {
		const news = Publications.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit);
		setNews(news);
		setMaxPage(Math.ceil(Publications.length / limit) || 1);
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
export { SortSwitch };
