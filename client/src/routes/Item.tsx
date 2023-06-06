import { Link, useParams } from "react-router-dom";
import Items from "../mock/Items";
import { Box, Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import DataGroup from "../components/Common/DataGroup";
import { useTheme } from "@mui/material/styles";
import Genres from "../mock/Genres";
import Companies from "../mock/Companies";
import Carousel from "../components/Item/Carousel";
import CarouselImage from "../components/Item/CarouselImage";
import Chip from "../components/Common/Chip";
import Content from "../components/Item/Content";
import ItemsComments from "../mock/ItemsComments";
import Users from "../mock/Users";
import CommentsList from "../components/Common/CommentsList";
import HTTPError from "../HTTPError";
import ItemRating from "../components/Common/ItemRating";

const CoverImage = styled("img")`
	width: 100%;
	aspect-ratio: 32/5;
	object-fit: cover;
	mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0));
`;

export default function Item() {
	const theme = useTheme();
	const { id } = useParams();
	if (!id) throw new HTTPError(400, "Не вказано ID товару");

	const parsed = parseInt(id);
	if (isNaN(parsed)) throw new HTTPError(400, "ID товару не є числом");

	const item = Items.find((item) => item.id === parsed);
	if (!item) throw new HTTPError(404, "Товар за даним ID не знайдено");

	document.title = `${item.name} — gigashop`;

	const genres = Genres.filter((genre) => item.genres?.includes(genre.id));
	const publisher = Companies.find((company) => company.id === item.publisher);
	const developers = Companies.filter((company) => item.developers?.includes(company.id));
	const comments = ItemsComments.filter((comment) => comment.itemId === item.id);

	comments.forEach((comment) => {
		comment.user = Users.find((user) => user.id === comment.userId);
	});

	return (
		<Container maxWidth={false} disableGutters>
			{item.coverImage && (
				<Box>
					<CoverImage src={item.coverImage} alt={item.name} />
				</Box>
			)}
			<Content
				sx={{
					gridTemplateColumns: {
						xs: "1fr",
						md: "3fr 2fr",
					},
					gap: "10px",
				}}
			>
				<Typography
					component='h2'
					variant='h3'
					my={3}
					textAlign='center'
					sx={{ gridColumn: { xs: "1 / 2", sm: "1 / 3" } }}
				>
					{item.name}
				</Typography>
				<Box
					sx={{
						gridColumn: 1,
						gridRow: "2 / 8",
					}}
				>
					<Carousel
						animation='slide'
						indicatorIconButtonProps={{
							style: {
								color: theme.colors.secondary,
							},
						}}
						activeIndicatorIconButtonProps={{
							style: {
								color: theme.colors.accent,
							},
						}}
					>
						<CarouselImage src={item.mainImage} alt={item.name} />
						<CarouselImage src={item.mainImage} alt={item.name} />
						<CarouselImage src={item.mainImage} alt={item.name} />
					</Carousel>
				</Box>
				<DataGroup title='Видавець'>
					{publisher ? (
						<Typography
							variant='body1'
							component={Link}
							to={`/shop/companies/${publisher.id}`}
							sx={{
								color: theme.colors.primary,
								textDecoration: "none",
								"&:hover": {
									color: theme.colors.primary,
									textDecoration: "underline",
								},
							}}
						>
							{publisher.name}
						</Typography>
					) : (
						<Typography variant='body1'>Не вказано</Typography>
					)}
				</DataGroup>
				<DataGroup title='Розробники'>
					{developers?.map((developer) => (
						<Chip
							key={developer.id.toString(16)}
							component={Link}
							to={`/shop/companies/${developer.id}`}
							sx={{
								color: theme.colors.secondary,
								textDecoration: "none",
								"&:hover": {
									color: theme.colors.secondary,
									cursor: "pointer",
								},
							}}
							label={<Typography variant='body2'>{developer.name}</Typography>}
						/>
					)) || <Typography variant='body1'>Не вказано</Typography>}
				</DataGroup>
				<DataGroup title='Жанри'>
					{genres?.map((genre, index) => (
						<Chip
							key={index}
							component={Link}
							to={`/shop/genres/${genre.id}`}
							sx={{
								color: theme.colors.secondary,
								textDecoration: "none",
								"&:hover": {
									color: theme.colors.secondary,
									cursor: "pointer",
								},
							}}
							label={<Typography variant='body2'>{genre.name}</Typography>}
						/>
					)) || <Typography variant='body1'>Не вказано</Typography>}
				</DataGroup>
				<DataGroup title='Дата випуску'>
					<Typography variant='body1'>{item.releaseDate.toLocaleDateString() || "Не вказано"}</Typography>
				</DataGroup>
				<ItemRating comments={comments} />
				<DataGroup title='Ціна'>
					<Typography component='p' variant='body1'>
						{item.price ? item.price.toString() + " грн" : "Не вказано"}
					</Typography>
				</DataGroup>
				<DataGroup title='Кількість' column='1/3'>
					<Typography component='p' variant='body1'>
						{item.amount
							? item.amount > 0
								? `${item.amount.toString()} шт`
								: "Немає в наявності"
							: "Не вказано"}
					</Typography>
				</DataGroup>
				<DataGroup title='Опис' column='1/3'>
					<Typography component='p' variant='body1'>
						{item.description || "Не вказано"}
					</Typography>
				</DataGroup>
				<DataGroup title='Додаткові характеристики' column='1/3'>
					{item.characteristics ? (
						<Box>
							{Object.entries(item.characteristics).map(([key, value]) => (
								<Typography key={key} variant='body1'>
									{key}: {value}
								</Typography>
							))}
						</Box>
					) : (
						<Typography variant='body1'>Не вказано</Typography>
					)}
				</DataGroup>
				{comments.length > 0 && <CommentsList comments={comments} />}
			</Content>
		</Container>
	);
}
