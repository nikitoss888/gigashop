import { Box, IconButton, Tooltip } from "@mui/material";
import { DeleteGenreRequest, Genre } from "../../http/Genres";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import List from "../../components/Admin/Items/List";
import { SortSwitch } from "../Items";
import ClientError from "../../ClientError";
import { DeleteItemRequest, Item } from "../../http/Items";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

export default function AdminGenre() {
	const { genre, error } = useLoaderData() as {
		genre: Genre & {
			Items?: Item[];
		};
		error?: ClientError;
	};

	if (error) throw error;
	const navigate = useNavigate();

	const initSortBy = "releaseDateAsc";
	const initLimit = 12;
	const initPage = 1;

	document.title = `${genre.name} — Адміністративна панель — gigashop`;

	const [sortBy, setSortBy] = useState(initSortBy);
	const [limit, setLimit] = useState(initLimit);
	const [page, setPage] = useState(initPage);

	const [items, setItems] = useState(genre.Items || []);
	const [maxPage, setMaxPage] = useState(Math.ceil((genre.Items?.length || 1) / limit) || 1);

	const getItems = (sortBy: string, limit: number, page: number) => {
		const { sortBy: specificSortBy, descending } = SortSwitch(sortBy);
		const items =
			genre.Items?.sort((a, b) => {
				if (descending) {
					switch (specificSortBy) {
						default:
						case "releaseDate":
							return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
						case "name":
							return b.name.localeCompare(a.name);
						case "price":
							return b.price - a.price;
					}
				} else {
					switch (specificSortBy) {
						default:
						case "releaseDate":
							return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
						case "name":
							return a.name.localeCompare(b.name);
						case "price":
							return a.price - b.price;
					}
				}
			}).slice((page - 1) * limit, page * limit) || [];
		setItems(items);
		setMaxPage(Math.max(Math.ceil((items.length || 1) / limit) || 1));
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

	const onDeleteThis = async () => {
		const token = Cookies.get("token");
		if (!token) throw new ClientError(403, "Ви не авторизовані");
		const response = await DeleteGenreRequest(token, genre.id).catch((e: unknown) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (response instanceof ClientError) throw response;
		navigate("/admin/genres");
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

		if (result) {
			setItems(items.filter((item) => item.id !== id));
			await getItems(sortBy, limit, page);
		}
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
					<IconButton onClick={onDeleteThis}>
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
