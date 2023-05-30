import { Link, useParams } from "react-router-dom";
import Items from "../mock/Items";
import { Box, Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import DataGroup from "../components/DataGroup";
import { useTheme } from "@mui/material/styles";
import Genres from "../mock/Genres";
import Companies from "../mock/Companies";
import Carousel from "../components/Item/Carousel";
import CarouselImage from "../components/Item/CarouselImage";
import Chip from "../components/Item/Chip";
import Content from "../components/Item/Content";

const CoverImage = styled("img")`
	width: 100%;
	aspect-ratio: 32/5;
	object-fit: cover;
	mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0));
`;

export default function Item() {
	const theme = useTheme();
	const { id } = useParams();
	const item = Items.find((item) => item.id.toString() === id);

	if (!item) {
		const error = new Error("Товар за даним ID не знайдено");
		error.name = "404";
		throw error;
	}
	document.title = `gigashop — ${item.name}`;
	const genres = Genres.filter((genre) => item.genres?.includes(genre.id));
	const publisher = Companies.find((company) => company.id === item.publisher);
	const developers = Companies.filter((company) => item.developers?.includes(company.id));

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
						gridRow: "2 / 7",
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
					<Typography variant='body1'>{publisher?.name || "Не вказано"}</Typography>
				</DataGroup>
				<DataGroup title='Розробники'>
					{developers?.map((developer) => (
						<Chip
							key={developer.id.toString(16)}
							label={
								<Typography
									variant='body2'
									component={Link}
									to={`/shop/companies/${developer.id}`}
									sx={{
										color: theme.colors.secondary,
										textDecoration: "none",
										"&:hover": {
											color: theme.colors.secondary,
										},
									}}
								>
									{developer.name}
								</Typography>
							}
						/>
					)) || <Typography variant='body1'>Не вказано</Typography>}
				</DataGroup>
				<DataGroup title='Жанри'>
					{genres?.map((genre, index) => (
						<Chip
							key={index}
							label={
								<Typography
									variant='body2'
									component={Link}
									to={`/shop/genres/${genre.id}`}
									sx={{
										color: theme.colors.secondary,
										textDecoration: "none",
										"&:hover": {
											color: theme.colors.secondary,
										},
									}}
								>
									{genre.name}
								</Typography>
							}
						/>
					)) || <Typography variant='body1'>Не вказано</Typography>}
				</DataGroup>
				<DataGroup title='Дата випуску'>
					<Typography variant='body1'>{item.date.toLocaleDateString() || "Не вказано"}</Typography>
				</DataGroup>
				<DataGroup title='Ціна'>
					<Typography component='p' variant='body1'>
						{item.price ? item.price.toString() + " грн" : "Не вказано"}
					</Typography>
				</DataGroup>
				<DataGroup title='Опис' column='1/3'>
					<Typography component='p' variant='body1'>
						{item.description || "Не вказано"}
					</Typography>
				</DataGroup>
			</Content>
		</Container>
	);
}
