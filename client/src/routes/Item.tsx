import { Link, useLoaderData } from "react-router-dom";
import { Item as ItemType } from "../mock/Items";
import { Alert, AlertTitle, Typography, Box, ButtonGroup, Button, Container, Dialog, AlertColor } from "@mui/material";
import styled from "@mui/material/styles/styled";
import DataGroup from "../components/Common/DataGroup";
import { useTheme } from "@mui/material/styles";
import Carousel from "../components/Item/Carousel";
import CarouselImage from "../components/Item/CarouselImage";
import Chip from "../components/Common/Chip";
import Content from "../components/Item/Content";
import CommentsList from "../components/Common/CommentsList";
import ClientError from "../ClientError";
import ItemRating from "../components/Common/ItemRating";
import { FormEvent, useState } from "react";

const CoverImage = styled("img")`
	width: 100%;
	aspect-ratio: 32/5;
	object-fit: cover;
	mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0));
`;

export default function Item() {
	const theme = useTheme();

	const { item, error } = useLoaderData() as {
		item: ItemType;
		error?: ClientError;
	};

	const [openDialog, setOpenDialog] = useState(false);
	const [alert, setAlert] = useState<{
		title: string;
		message: string;
		severity: AlertColor | undefined;
	}>({ title: "", message: "", severity: undefined });
	const onWishlist = () => {
		console.log("Added to wishlist");
		setAlert({ title: "Успіх!", message: "Товар успішно додано до списку бажань!", severity: "success" });
		setOpenDialog(true);
	};

	const [message, setMessage] = useState("");
	const [rating, setRating] = useState(0);
	const onRate = (event: FormEvent) => {
		event.preventDefault();
		console.log("Rated");
		setAlert({ title: "Успіх!", message: "Ваш відгук успішно додано!", severity: "success" });
		setOpenDialog(true);
	};

	if (error) throw error;

	document.title = `${item.name} — gigashop`;

	const images = [item.mainImage, ...item.images];

	return (
		<>
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
						sx={{ gridColumn: { xs: "1 / 2", md: "1 / 3" } }}
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
							height='390px'
							stopAutoPlayOnHover
							swipe
							fullHeightHover
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
							{images.map((image) => (
								<CarouselImage key={image} src={image} alt={item.name} />
							))}
						</Carousel>
					</Box>
					<DataGroup title='Видавець'>
						{item.publisher ? (
							<Typography
								variant='body1'
								component={Link}
								to={`/shop/companies/${item.publisher.id}`}
								sx={{
									color: theme.colors.primary,
									textDecoration: "none",
									"&:hover": {
										color: theme.colors.primary,
										textDecoration: "underline",
									},
								}}
							>
								{item.publisher.name}
							</Typography>
						) : (
							<Typography variant='body1'>Не вказано</Typography>
						)}
					</DataGroup>
					<DataGroup title='Розробники'>
						{item.developers?.map((developer) => (
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
								label={
									<Typography variant='body2' color='secondary'>
										{developer.name}
									</Typography>
								}
							/>
						)) || (
							<Typography variant='body1' color='secondary'>
								Не вказано
							</Typography>
						)}
					</DataGroup>
					<DataGroup title='Жанри'>
						{item.genres?.map((genre, index) => (
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
								label={
									<Typography variant='body2' color='secondary'>
										{genre.name}
									</Typography>
								}
							/>
						)) || (
							<Typography variant='body1' color='secondary'>
								Не вказано
							</Typography>
						)}
					</DataGroup>
					<DataGroup title='Дата випуску'>
						<Typography variant='body1'>{item.releaseDate.toLocaleDateString() || "Не вказано"}</Typography>
					</DataGroup>
					{item.comments && <ItemRating comments={item.comments} />}
					<DataGroup title='Ціна'>
						<Typography component='p' variant='body1'>
							{item.price ? item.price.toString() + " грн" : "Не вказано"}
						</Typography>
					</DataGroup>
					<ButtonGroup>
						<Button
							variant='contained'
							onClick={onWishlist}
							sx={{
								color: "secondary.main",
								backgroundColor: "primary.main",
							}}
						>
							Додати до списку бажань
						</Button>
					</ButtonGroup>
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
					<DataGroup title='Характеристики' column='1/3'>
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
					{item.comments && (
						<CommentsList
							comments={item.comments}
							onSubmit={onRate}
							message={{
								value: message,
								setValue: setMessage,
							}}
							rate={{
								value: rating,
								setValue: setRating,
							}}
						/>
					)}
				</Content>
			</Container>
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<Alert severity={alert.severity}>
					<AlertTitle>{alert.title}</AlertTitle>
					{alert.message}
				</Alert>
			</Dialog>
		</>
	);
}
