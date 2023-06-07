import { Link, useParams } from "react-router-dom";
import HTTPError from "../../HTTPError";
import Items from "../../mock/Items";
import Genres from "../../mock/Genres";
import Companies from "../../mock/Companies";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ItemsComments from "../../mock/ItemsComments";
import Users from "../../mock/Users";
import styled from "@mui/material/styles/styled";
import { Delete, Edit } from "@mui/icons-material";

const Image = styled("img")`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

export default function AdminItem() {
	const { id } = useParams();
	if (!id) throw new HTTPError(400, "Не вказано ID товару");

	const parsed = parseInt(id);
	if (isNaN(parsed)) throw new HTTPError(400, "ID товару не є числом");

	const item = Items.find((item) => item.id === parsed);
	if (!item) throw new HTTPError(404, "Товар за даним ID не знайдено");

	document.title = `${item.name} — Адміністративна панель — gigashop`;

	const genres = Genres.filter((genre) => item.genres?.includes(genre.id));
	const publisher = Companies.find((company) => company.id === item.publisher);
	const developers = Companies.filter((company) => item.developers?.includes(company.id));

	const comments = ItemsComments.filter((comment) => comment.itemId === item.id);
	let avgRate = comments.reduce((acc, comment) => acc + comment.rate, 0) / comments.length || 0;
	avgRate = Math.round(avgRate * 10) / 10;

	comments.forEach((comment) => {
		comment.user = Users.find((user) => user.id === comment.userId);
	});

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
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
			<Typography variant='h6'>Жанри: {genres.map((genre) => genre.name).join(", ")}</Typography>
			<Typography variant='h6'>Видавець: {publisher?.name}</Typography>
			<Typography variant='h6'>Розробники: {developers.map((developer) => developer.name).join(", ")}</Typography>
			<Typography variant='h6'>Ціна: {item.price}</Typography>
			<Typography variant='h6'>Кількість: {item.amount}</Typography>
			<Typography variant='h6'>Дата виходу: {item.releaseDate.toLocaleDateString()}</Typography>
			<Typography variant='h6'>Рейтинг: {avgRate}</Typography>
			<Typography variant='h6'>Опис: {item.description}</Typography>
		</Box>
	);
}
