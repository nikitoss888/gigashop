import { useEffect, useState } from "react";
import Publications, { Publication } from "../../mock/Publications";
import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/News/List";

const SortSwitch = (sortBy: string, a: Publication, b: Publication) => {
	switch (sortBy) {
		case "titleDesc":
			return b.title.localeCompare(a.title);
		case "titleAsc":
			return a.title.localeCompare(b.title);
		case "createdAtDesc":
			return b.createdAt.getTime() - a.createdAt.getTime();
		case "createdAtAsc":
		default:
			return a.createdAt.getTime() - b.createdAt.getTime();
	}
};
export default function AdminNews() {
	document.title = "Новини - Адміністративна панель - gigashop";

	const [sortBy, setSortBy] = useState("createdAtAsc");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const [news, setNews] = useState(
		Publications.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit)
	);
	const [maxPage, setMaxPage] = useState(Math.ceil(Publications.length / limit) || 1);

	const getNews = (refresh?: boolean) => {
		const localPage = refresh ? 1 : page;
		const news = Publications.sort((a, b) => SortSwitch(sortBy, a, b)).slice(
			(localPage - 1) * limit,
			localPage * limit
		);
		setNews(news);
		refresh && setMaxPage(Math.ceil(Publications.length / limit) || 1);
	};

	useEffect(() => {
		setPage(1);
		getNews(true);
	}, [sortBy, limit]);

	useEffect(() => {
		getNews();
	}, [page]);

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список публікацій
			</Typography>
			<List
				news={news}
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
			/>
		</Box>
	);
}
