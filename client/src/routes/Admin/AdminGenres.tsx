import { useState } from "react";
import Genres, { Genre } from "../../mock/Genres";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import List from "../../components/Admin/Genres/List";
import { useLoaderData } from "react-router-dom";

const SortSwitch = (sortBy: string, a: Genre, b: Genre) => {
	switch (sortBy) {
		case "nameDesc":
			return b.name.localeCompare(a.name);
		default:
		case "nameAsc":
			return a.name.localeCompare(b.name);
	}
};

export default function AdminGenre() {
	document.title = "Жанри - Адміністративна панель - gigashop";

	const [sortBy, setSortBy] = useState("nameAsc");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const { data, totalCount } = useLoaderData() as {
		data: Genre[];
		totalCount: number;
	};

	const [genres, setGenres] = useState(
		data.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit) || []
	);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 0) / limit) || 1);

	const getGenres = (sortBy: string, limit: number, page: number) => {
		const genres = Genres.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit);
		setGenres(genres);
		setMaxPage(Math.ceil(Genres.length / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getGenres(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getGenres(sortBy, limit, page);
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
