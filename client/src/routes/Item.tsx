import { Link, useLoaderData } from "react-router-dom";
import {
	Item as ItemType,
	ItemRate,
	DeleteItemRateRequest,
	SetItemRateRequest,
	ToggleWishlistItemRequest,
	ToggleCartItemRequest,
} from "../http/Items";
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
import { Company } from "../http/Companies";
import { Genre } from "../http/Genres";
import { User } from "../http/User";
import { useRecoilState } from "recoil";
import { userState } from "../store/User";
import Cookies from "js-cookie";

const CoverImage = styled("img")`
	width: 100%;
	aspect-ratio: 32/5;
	object-fit: cover;
	mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0));
`;

export default function Item() {
	const [user, _] = useRecoilState(userState);
	const theme = useTheme();

	const { item, error } = useLoaderData() as {
		item: ItemType & {
			Publisher?: Company | null;
			Developers?: Company[];
			Genres?: Genre[];
			Rates?: (ItemRate & {
				User: User;
			})[];
			WishlistedUsers?: User[];
			CartedUsers?: User[];
		};
		error?: ClientError;
	};

	if (error) throw error;

	const publisher = item.Publisher || null;
	const developers = item.Developers || [];
	const genres = item.Genres || [];
	const rates = item.Rates || [];
	const wishlisted = item.WishlistedUsers || [];
	const carted = item.CartedUsers || [];

	const [isWishlisted, setIsWishlisted] = useState(wishlisted?.find((user) => user.id === user?.id) !== undefined);
	const [isCarted, setIsCarted] = useState(carted?.find((user) => user.id === user?.id) !== undefined);

	const [openDialog, setOpenDialog] = useState(false);
	const [alert, setAlert] = useState<{
		title: string;
		message: string;
		severity: AlertColor | undefined;
	}>({ title: "", message: "", severity: undefined });

	const onWishlist = async () => {
		const token = Cookies.get("token");
		if (!token) throw new ClientError(403, "Ви не авторизовані!");

		const result = await ToggleWishlistItemRequest(token, item.id).catch((error) => {
			setAlert({ title: "Помилка!", message: error.message, severity: "error" });
			setOpenDialog(true);
			return undefined;
		});
		if (!result) return;

		setIsWishlisted(!isWishlisted);

		setAlert({ title: "Успіх!", message: result.message, severity: "success" });
		setOpenDialog(true);
	};

	const onCart = async () => {
		const token = Cookies.get("token");
		if (!token) throw new ClientError(403, "Ви не авторизовані!");

		const result = await ToggleCartItemRequest(token, item.id).catch((error) => {
			setAlert({ title: "Помилка!", message: error.message, severity: "error" });
			setOpenDialog(true);
			return undefined;
		});
		if (!result) return;

		setIsCarted(!isCarted);

		setAlert({ title: "Успіх!", message: result.message, severity: "success" });
		setOpenDialog(true);
	};

	const [userComment, setUserComment] = useState(rates?.find((rate) => rate.userId === user?.id));
	const [message, setMessage] = useState(userComment?.content || "");
	const [rating, setRating] = useState(userComment?.rate || 0);
	const onRate = async (event: FormEvent) => {
		event.preventDefault();

		const token = Cookies.get("token");
		if (!token) {
			setAlert({ title: "Помилка!", message: "Ви не авторизовані!", severity: "error" });
			setOpenDialog(true);
			return;
		}

		const result = await SetItemRateRequest(token, item.id, rating, message).catch((error) => {
			setAlert({ title: "Помилка!", message: error.message, severity: "error" });
			setOpenDialog(true);
			return undefined;
		});
		if (result === undefined) return;

		setUserComment({ ...result.rate, User: result.user });

		setAlert({ title: "Успіх!", message: result.message, severity: "success" });
		setOpenDialog(true);
	};

	const onDelete = async () => {
		const token = Cookies.get("token");
		if (!token) {
			setAlert({ title: "Помилка!", message: "Ви не авторизовані!", severity: "error" });
			setOpenDialog(true);
			return;
		}

		const result = await DeleteItemRateRequest(token, item.id).catch((error) => {
			setAlert({ title: "Помилка!", message: error.message, severity: "error" });
			setOpenDialog(true);
			return false;
		});
		if (!result) return;

		setUserComment(undefined);
	};

	const allRates = rates.filter((rate) => rate.userId !== user?.id);

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
						{developers && developers.length > 0 ? (
							developers.map((developer) => (
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
							))
						) : (
							<Typography variant='body1' color='secondary'>
								Не вказано
							</Typography>
						)}
					</DataGroup>
					<DataGroup title='Жанри'>
						{genres && genres.length > 0 ? (
							genres.map((genre, index) => (
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
							))
						) : (
							<Typography variant='body1' color='secondary'>
								Не вказано
							</Typography>
						)}
					</DataGroup>
					<DataGroup title='Дата випуску'>
						<Typography variant='body1'>
							{new Date(item.releaseDate).toLocaleDateString() || "Не вказано"}
						</Typography>
					</DataGroup>
					<ItemRating comments={rates} />
					<DataGroup title='Ціна'>
						<Typography component='p' variant='body1'>
							{item.price ? item.price.toString() + " грн" : "Не вказано"}
						</Typography>
					</DataGroup>
					{user && (
						<ButtonGroup
							fullWidth
							sx={{
								gridColumn: {
									xs: "1 / 2",
									md: "1 / 3",
								},
							}}
						>
							<Button
								variant='contained'
								onClick={onWishlist}
								sx={{
									color: "secondary.main",
									backgroundColor: isWishlisted ? "primary.main" : "accent.main",
								}}
							>
								{isWishlisted ? "Видалити зі списку бажань" : "Додати до списку бажань"}
							</Button>
							<Button
								variant='contained'
								onClick={onCart}
								sx={{
									color: "secondary.main",
									backgroundColor: isCarted ? "primary.main" : "accent.main",
								}}
							>
								{isCarted ? "Видалити з кошика" : "Додати до кошика"}
							</Button>
						</ButtonGroup>
					)}
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
					<CommentsList
						comments={allRates}
						userComment={userComment}
						onSubmit={onRate}
						onDelete={onDelete}
						message={{
							value: message,
							setValue: setMessage,
						}}
						rate={{
							value: rating,
							setValue: setRating,
						}}
					/>
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
