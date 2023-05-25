import { useParams } from "react-router-dom";
import Items from "../mock/Items";
import { Box, Chip, Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import DataGroup from "../components/Item/DataGroup";
import Carousel from "react-material-ui-carousel";
import { useTheme } from "@mui/material/styles";

const CoverImage = styled("img")`
	width: 100%;
	height: 200px;
	object-fit: cover;
	mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0));
`;

const Content = styled(Container)`
	display: grid;
	grid-template-rows: repeat(auto-fill, 1fr);
	grid-gap: 5px 20px;
`;

const CarouselStyle = styled(Carousel)`
	width: 100%;
	background-color: ${(props) => props.theme.colors.primary};
	border-radius: 5px;
	padding-bottom: 20px;
`;

const CarouselImage = styled("img")`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const ChipStyle = styled(Chip)`
	background-color: ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.secondary};
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

	return (
		<Container maxWidth={false} disableGutters>
			{item?.coverImage && (
				<Box>
					<CoverImage src={item.coverImage} alt={item?.name} />
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
					component='h1'
					variant='h3'
					my={3}
					textAlign='center'
					sx={{ gridColumn: { xs: "1 / 2", sm: "1 / 3" } }}
				>
					{item?.name}
				</Typography>
				<Box
					sx={{
						gridColumn: 1,
						gridRow: "2 / 7",
					}}
				>
					<CarouselStyle
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
						<CarouselImage src={item?.image} alt={item?.name} />
						<CarouselImage src={item?.image} alt={item?.name} />
						<CarouselImage src={item?.image} alt={item?.name} />
					</CarouselStyle>
				</Box>
				<DataGroup title='Видавець'>
					<Typography variant='body1'>{item?.publisher || "Не вказано"}</Typography>
				</DataGroup>
				<DataGroup title='Розробники'>
					{item?.developers?.map((developer, index) => (
						<ChipStyle key={index} label={<Typography variant='body2'>{developer}</Typography>} />
					)) || <Typography variant='body1'>Не вказано</Typography>}
				</DataGroup>
				<DataGroup title='Жанри'>
					{item?.genres?.map((genre, index) => (
						<ChipStyle key={index} label={<Typography variant='body2'>{genre}</Typography>} />
					)) || <Typography variant='body1'>Не вказано</Typography>}
				</DataGroup>
				<DataGroup title='Дата випуску'>
					<Typography variant='body1'>{item?.date.toLocaleDateString() || "Не вказано"}</Typography>
				</DataGroup>
				<DataGroup title='Ціна'>
					<Typography component='p' variant='body1'>
						{item?.price ? item.price.toString() + " грн" : "Не вказано"}
					</Typography>
				</DataGroup>
				<DataGroup title='Опис' column='1/3'>
					<Typography component='p' variant='body1'>
						{item?.description || "Не вказано"}
					</Typography>
				</DataGroup>
			</Content>
		</Container>
	);
}
