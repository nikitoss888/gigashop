import { Link, useLoaderData } from "react-router-dom";
import { Item } from "../../mock/Items";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import styled from "@mui/material/styles/styled";
import { Delete, Edit } from "@mui/icons-material";
import Chip from "../../components/Common/Chip";
import ClientError from "../../ClientError";
import List from "../../components/Admin/ItemsComments/List";
import { useState } from "react";
import { SortSwitch as ItemsRatesSortSwitch } from "./AdminItemsComments";

const Image = styled("img")`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

export default function AdminItem() {
	const { item, error } = useLoaderData() as { item: Item; error?: ClientError };
	if (error) throw error;

	document.title = `${item.name} — Адміністративна панель — gigashop`;

	const genres = item.genres || [];
	const publisher = item.publisher || null;
	const developers = item.developers || [];

	const [sortBy, setSortBy] = useState("createdAtAsc");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const [comments, setComments] = useState(item.comments || []);
	const [maxPage, setMaxPage] = useState(Math.ceil((item.comments?.length || 1) / limit) || 1);

	let avgRate = comments.reduce((acc, comment) => acc + comment.rate, 0) / comments.length || 0;
	avgRate = Math.round(avgRate * 10) / 10;

	const getComments = (sortBy: string, limit: number, page: number) => {
		const { descending } = ItemsRatesSortSwitch(sortBy);
		const comments =
			item.comments
				?.sort((a, b) => {
					if (descending) {
						return b.createdAt.getTime() - a.createdAt.getTime();
					} else {
						return a.createdAt.getTime() - b.createdAt.getTime();
					}
				})
				.slice((page - 1) * limit, page * limit) || [];
		setComments(comments);
		setMaxPage(Math.ceil((item.comments?.length || 1) / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getComments(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getComments(sortBy, limit, page);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getComments(sortBy, limit, localPage);
		setPage(localPage);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "start",
				gap: "10px",
			}}
		>
			<Typography variant='h4' textAlign='center' mb={3}>
				Сторінка товару #{item.id}
			</Typography>
			<Box
				sx={{
					display: "flex",
					gap: "10px",
				}}
			>
				<Tooltip title={`Редагувати товар`}>
					<IconButton component={Link} to={`/admin/items/${item.id}/edit`}>
						<Edit sx={{ color: "primary.main" }} />
					</IconButton>
				</Tooltip>
				<Tooltip title={`Видалити товар`}>
					<IconButton>
						<Delete color='error' />
					</IconButton>
				</Tooltip>
			</Box>
			<Typography variant='h6'>Назва: {item.name}</Typography>
			<Typography variant='h6'>Головне зображення</Typography>
			<Box
				sx={{
					width: "350px",
				}}
			>
				<Image src={item.mainImage} alt={item.mainImage} />
			</Box>
			<Typography variant='h6'>Зображення для обгортки</Typography>
			<Box
				sx={{
					width: "350px",
				}}
			>
				{item.coverImage ? (
					<Image src={item.coverImage} alt={item.coverImage} />
				) : (
					<Typography variant='body1'>Не вказано</Typography>
				)}
			</Box>
			<Typography variant='h6'>Зображення</Typography>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
					gridTemplateRows: "repeat(auto-fit, minmax(200px, 1fr))",
					gap: "10px",
				}}
			>
				{item.images.map((image) => (
					<Image key={image} src={image} alt={image} />
				))}
			</Box>
			<Typography variant='h6'>Жанри:</Typography>
			<Box
				sx={{
					display: "flex",
					gap: "10px",
				}}
			>
				{genres.map((genre) => (
					<Chip
						component={Link}
						to={`/admin/genres/${genre.id}`}
						key={genre.id.toString(16)}
						label={genre.name}
						sx={{ cursor: "pointer" }}
					/>
				))}
			</Box>
			<Typography variant='h6'>Видавець:</Typography>
			{publisher && (
				<Chip
					component={Link}
					to={`/admin/companies/${publisher?.id}`}
					label={publisher?.name}
					sx={{ cursor: "pointer" }}
				/>
			)}
			<Typography variant='h6'>Розробники:</Typography>
			<Box
				sx={{
					display: "flex",
					gap: "10px",
				}}
			>
				{developers.map((developer) => (
					<Chip
						component={Link}
						to={`/admin/companies/${developer.id}`}
						key={developer.id.toString(16)}
						label={developer.name}
						sx={{ cursor: "pointer" }}
					/>
				))}
			</Box>
			<Typography variant='h6'>Ціна: {item.price}</Typography>
			<Typography variant='h6'>Кількість: {item.amount}</Typography>
			<Typography variant='h6'>Дата виходу: {item.releaseDate.toLocaleDateString()}</Typography>
			<Typography variant='h6'>Рейтинг: {avgRate}</Typography>
			<Typography variant='h6'>Опис: {item.description}</Typography>
			<Box>
				<Typography variant='h6' mb={2}>
					Коментарі:
				</Typography>
				<List
					comments={comments}
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
					linkToUser
				/>
			</Box>
		</Box>
	);
}
