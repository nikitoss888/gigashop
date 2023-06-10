import { useState } from "react";
import { Genre } from "../../mock/Genres";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import List from "../../components/Admin/Genres/List";
import { useLoaderData } from "react-router-dom";
import { GetGenres } from "../index";

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

	const { data, totalCount, initSortBy, initLimit, initPage } = useLoaderData() as {
		data: Genre[];
		totalCount: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
	};

	const [sortBy, setSortBy] = useState(initSortBy || "nameAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const [genres, setGenres] = useState(data);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getGenres = (sortBy: string, limit: number, page: number) => {
		const { data, totalCount } = GetGenres({ admin: true, sortBy, limit, page });
		setGenres(data);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getGenres(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getGenres(sortBy, limit, 1);
		setPage(1);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getGenres(sortBy, limit, localPage);
		setPage(localPage);
	};

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список жанрів
			</Typography>
			<List
				genres={genres}
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
