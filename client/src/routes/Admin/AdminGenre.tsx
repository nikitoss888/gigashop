import { Box, IconButton, Tooltip } from "@mui/material";
import { Genre } from "../../mock/Genres";
import { Link, useLoaderData } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import Items from "../../mock/Items";
import List from "../../components/Admin/Items/List";
import { SortSwitch } from "../Items";
import ClientError from "../../ClientError";

export default function AdminGenre() {
	const { genre, error, totalCount } = useLoaderData() as {
		genre: Genre;
		totalCount: number;
		error?: ClientError;
	};

	if (error) throw error;

	const initSortBy = "releaseDateAsc";
	const initLimit = 12;
	const initPage = 1;

	document.title = `${genre.name} — Адміністративна панель — gigashop`;

	const [sortBy, setSortBy] = useState(initSortBy);
	const [limit, setLimit] = useState(initLimit);
	const [page, setPage] = useState(initPage);

	const [items, setItems] = useState(genre.items || []);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 0) / limit) || 1);

	const getItems = (sortBy: string, limit: number, page: number) => {
		const items =
			genre.items?.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit) || [];
		setItems(items);
		setMaxPage(Math.ceil(Items.length / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getItems(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getItems(sortBy, limit, page);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getItems(sortBy, limit, localPage);
		setPage(localPage);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "10px",
			}}
		>
			<Typography variant='h4' textAlign='center' mb={3}>
				Жанр №{genre.id}
			</Typography>
			<Box
				sx={{
					display: "flex",
					gap: "10px",
				}}
			>
				<Tooltip title={`Редагувати жанр`}>
					<IconButton component={Link} to={`/admin/genres/${genre.id}/edit`}>
						<Edit sx={{ color: "primary.main" }} />
					</IconButton>
				</Tooltip>
				<Tooltip title={`Видалити жанр`}>
					<IconButton>
						<Delete color='error' />
					</IconButton>
				</Tooltip>
			</Box>
			<Typography variant='h6'>Назва: {genre.name}</Typography>
			<Box>
				<Typography variant='h6'>Опис:</Typography>
				<Typography variant='body1'>{genre.description}</Typography>
			</Box>
			<Typography variant='h6'>Товари:</Typography>
			<List
				items={items}
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
