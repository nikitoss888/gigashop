import { useLoaderData } from "react-router-dom";
import ClientError from "../../ClientError";
import { CreateItemRequest, Item, ItemRate, UpdateItemRequest } from "../../http/Items";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Alert,
	AlertColor,
	AlertTitle,
	Autocomplete,
	Box,
	Button,
	ButtonGroup,
	Dialog,
	FormControlLabel,
	IconButton,
	TextField,
	Tooltip,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import styled from "@mui/material/styles/styled";
import { ReactNode, useState } from "react";
import WidgetSingle from "../../Cloudinary/WidgetSingle";
import WidgetMultiple from "../../Cloudinary/WidgetMultiple";
import Typography from "@mui/material/Typography";
import SubmitButton from "../../components/Common/SubmitButton";
import Chip from "../../components/Common/Chip";
import Checkbox from "../../components/Form/Checkbox";
import { Company } from "../../http/Companies";
import { Genre } from "../../http/Genres";
import { User } from "../../http/User";
import Cookies from "js-cookie";

const FormBox = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: 2rem;
`;

const InputBox = styled(Box)`
	display: flex;
	flex-direction: column;
`;

const ResponsiveBoxStyle = styled(Box)`
	display: grid;
	grid-template-rows: 1fr;
	gap: 2rem;
` as typeof Box;

const ResponsiveBox = ({ children, colsNum }: { children: ReactNode; colsNum: number | string }) => {
	return (
		<ResponsiveBoxStyle
			sx={{
				gridTemplateColumns: {
					xs: "1fr",
					sm: `repeat(${colsNum}, 1fr)`,
				},
			}}
		>
			{children}
		</ResponsiveBoxStyle>
	);
};

const Image = styled("img")`
	width: 100%;
	object-fit: contain;
`;

const ImagesGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	grid-template-rows: repeat(auto-fill, 1fr);
	gap: 1rem;
` as typeof Box;

const ImageBox = styled(Box)`
	position: relative;
	& > img {
		z-index: 1;
	}
	& > button {
		position: absolute;
		z-index: 2;
		top: 5px;
		right: 5px;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
	}
	&:hover {
		& > button {
			background-color: ${(props) => props.theme.colors.secondary};
			opacity: 1;
		}
	}
`;

type DataObject = {
	id: number;
	name: string;
};

const schema = yup.object().shape({
	name: yup.string().required().label("Назва"),
	description: yup.string().required().label("Опис"),
	releaseDate: yup.date().required().label("Дата виходу"),
	price: yup.number().min(0, "Ціна не може бути меншою за 0").required().label("Ціна"),
	amount: yup.number().default(0).min(0, "Кількість не може бути меншою за 0").required().label("Кількість"),
	discount: yup.boolean().default(false).required(),
	discountFrom: yup.date().when({
		is: (discount: boolean) => discount,
		then: (schema) =>
			schema
				.required()
				.max(yup.ref("discountTo"), "Початкова дата знижки не може бути пізніше кінцевої")
				.label("Початкова дата знижки"),
	}),
	discountTo: yup.date().when({
		is: (discount: boolean) => discount,
		then: (schema) =>
			schema
				.required()
				.min(yup.ref("discountFrom"), "Кінцева дата знижки не може бути раніше початкової")
				.label("Кінцева дата знижки"),
	}),
	discountSize: yup.number().when({
		is: (discount: boolean) => discount,
		then: (schema) =>
			schema
				.min(0, "Розмір знижки не може бути меншим за 0")
				.max(100, "Розмір знижки не може бути більшим за 100")
				.required()
				.label("Розмір знижки"),
	}),
	hide: yup.boolean().default(false).required(),
});

export default function AdminItemForm() {
	const { item, error, genres, companies } = useLoaderData() as {
		item?: Item & {
			Publisher: Company | null;
			Developers: Company[];
			Genres: Genre[];
			Rates: (ItemRate & {
				User: User;
			})[];
			WishlistedUsers: User[];
		};
		genres?: Genre[];
		companies?: Company[];
		error?: ClientError;
	};

	if (error) throw error;

	const [alert, setAlert] = useState<{
		title: string;
		message: string;
		severity: AlertColor | undefined;
	}>({ title: "", message: "", severity: undefined });
	const [openDialog, setOpenDialog] = useState(false);

	document.title =
		(item ? `Редагування товару ${item.name} (№${item.id})` : "Створення товару") +
		" — Адміністративна панель — gigashop";

	type FormValues = {
		name: string;
		description: string;
		releaseDate: Date | undefined;
		price: number | undefined;
		amount: number | undefined;
		discount: boolean;
		discountFrom: Date | undefined;
		discountTo: Date | undefined;
		discountSize: number | undefined;
		hide: boolean;
	};
	let defaultValues: FormValues = {
		name: "",
		description: "",
		releaseDate: undefined,
		price: undefined,
		amount: undefined,
		discount: false,
		discountFrom: undefined,
		discountTo: undefined,
		discountSize: undefined,
		hide: false,
	};
	if (item)
		defaultValues = {
			name: item.name,
			description: item.description,
			releaseDate: new Date(item.releaseDate),
			price: item.price,
			amount: item.amount,
			discount: item.discount,
			discountFrom: item.discountFrom !== null ? new Date(item.discountFrom) : undefined,
			discountTo: item.discountTo !== null ? new Date(item.discountTo) : undefined,
			discountSize: item.discountSize || undefined,
			hide: item.hide,
		};

	const methods = useForm({
		defaultValues,
		resolver: yupResolver(schema),
	});

	let locReleaseDate: Date | null = null;
	let locDiscountFrom: Date | null = null;
	let locDiscountTo: Date | null = null;

	if (item) {
		const offset = new Date(item.releaseDate).getTimezoneOffset();
		locReleaseDate = new Date(new Date(item.releaseDate).getTime() - offset * 60 * 1000);
		if (item.discountFrom) locDiscountFrom = new Date(new Date(item.discountFrom).getTime() - offset * 60 * 1000);
		if (item.discountTo) locDiscountTo = new Date(new Date(item.discountTo).getTime() - offset * 60 * 1000);
	}

	const [localReleaseDate, setLocalReleaseDate] = useState<Date | null>(locReleaseDate);
	const [localDiscountFrom, setLocalDiscountFrom] = useState<Date | null>(locDiscountFrom);
	const [localDiscountTo, setLocalDiscountTo] = useState<Date | null>(locDiscountTo);

	const [characteristics, setCharacteristics] = useState<string | null>(
		Object.entries(item?.characteristics || [])
			.map(([key, value]) => `${key}: ${value}`)
			.join(";\n") || null
	);

	const Genres =
		genres
			?.sort((a, b) => (a.name > b.name ? 1 : -1))
			.map((genre) => ({
				id: genre.id,
				name: genre.name,
			})) || [];
	const [itemGenres, setItemGenres] = useState<DataObject[]>(
		Genres.filter((genre) => item?.Genres.map((genre) => genre.id).includes(genre.id)).map((genre) => ({
			id: genre.id,
			name: genre.name,
		})) || []
	);

	const Companies =
		companies
			?.sort((a, b) => (a.name > b.name ? 1 : -1))
			.map((company) => ({
				id: company.id,
				name: company.name,
			})) || [];
	const publisher = Companies.find((company) => company.id === item?.company_publisherId);
	const [itemPublisher, setItemPublisher] = useState<DataObject | null>(
		publisher ? { id: publisher.id, name: publisher.name } : null
	);
	const [itemDevelopers, setItemDevelopers] = useState<DataObject[]>(
		Companies.filter((company) => item?.Developers.map((company) => company.id).includes(company.id)).map(
			(company) => ({
				id: company.id,
				name: company.name,
			})
		) || []
	);

	const [mainImage, setMainImage] = useState<string | null>(item?.mainImage || null);
	const [coverImage, setCoverImage] = useState<string | null>(item?.coverImage || null);
	const [images, setImages] = useState(item?.images || []);

	const { widgetRef: mainWidget } = WidgetSingle("dnqlgypji", "gigashop_items", setMainImage);
	const { widgetRef: coverWidget } = WidgetSingle("dnqlgypji", "gigashop_items", setCoverImage);
	const { widgetRef: imagesWidget } = WidgetMultiple("dnqlgypji", "gigashop_items", setImages);

	const uploadMainImage = () => mainWidget.current.open();
	const removeMainImage = () => setMainImage(null);

	const uploadCoverImage = () => coverWidget.current.open();
	const removeCoverImage = () => setCoverImage(null);

	const uploadImages = () => imagesWidget.current.open();
	const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));
	const removeImages = () => setImages([]);

	const onSubmit = async (hookFormData: any) => {
		let characteristicsObject: { [key: string]: string | number | boolean } | undefined;

		if (characteristics) {
			characteristicsObject = {};
			const characteristicsArray = characteristics.split(/;\n?/);
			for (const characteristic of characteristicsArray) {
				const [key, value] = characteristic.split(/:\s?/);
				if (!key || key.length === 0 || !value || value.length === 0) continue;
				characteristicsObject[key] = value;
			}
		}

		const token = Cookies.get("token");
		if (!token) throw new ClientError(403, "Ви не авторизовані");

		let result: Item | void;
		let error: ClientError | undefined;
		if (item) {
			result = await UpdateItemRequest(token, item.id, {
				name: hookFormData.name,
				description: hookFormData.description,
				releaseDate: localReleaseDate?.toISOString().slice(0, 10),
				price: hookFormData.price,
				amount: hookFormData.amount,
				discount: hookFormData.discount,
				discountFrom: hookFormData.discount ? localDiscountFrom?.toISOString().slice(0, 10) : undefined,
				discountTo: hookFormData.discount ? localDiscountTo?.toISOString().slice(0, 10) : undefined,
				discountSize: hookFormData.discount ? hookFormData.discountSize : undefined,
				mainImage: mainImage !== null ? mainImage : item.mainImage,
				images: images.length > 0 ? images : undefined,
				coverImage: coverImage || undefined,
				characteristics: characteristicsObject,
				hide: hookFormData.hide,
				publisherId: itemPublisher?.id || undefined,
				developersIds: itemDevelopers.map((developer) => developer.id),
				genresIds: itemGenres.map((genre) => genre.id),
			}).catch((err) => {
				if (err instanceof ClientError) error = err;
				if (err instanceof Error) error = new ClientError(500, err.message);
				error = new ClientError(500, "Помилка сервера");
			});
		} else {
			if (!localReleaseDate) {
				setAlert({
					severity: "error",
					title: "Помилка",
					message: "Дата виходу не вказана",
				});
				setOpenDialog(true);
				return;
			}

			if (!mainImage) {
				setAlert({
					severity: "error",
					title: "Помилка",
					message: "Головне зображення не завантажено",
				});
				setOpenDialog(true);
				return;
			}

			if (hookFormData.discount && localDiscountFrom === null) {
				setAlert({
					severity: "error",
					title: "Помилка",
					message: "Дата початку знижки не вказана",
				});
				setOpenDialog(true);
				return;
			}

			if (hookFormData.discount && localDiscountTo === null) {
				setAlert({
					severity: "error",
					title: "Помилка",
					message: "Дата закінчення знижки не вказана",
				});
				setOpenDialog(true);
				return;
			}

			if (hookFormData.discount && !hookFormData.discountSize) {
				setAlert({
					severity: "error",
					title: "Помилка",
					message: "Розмір знижки не вказано",
				});
				setOpenDialog(true);
				return;
			}

			result = await CreateItemRequest(token, {
				name: hookFormData.name,
				description: hookFormData.description,
				releaseDate: localReleaseDate.toISOString().slice(0, 10),
				price: hookFormData.price,
				amount: hookFormData.amount,
				discount: hookFormData.discount,
				discountFrom:
					hookFormData.discount && localDiscountFrom !== null
						? localDiscountFrom.toISOString().slice(0, 10)
						: null,
				discountTo:
					hookFormData.discount && localDiscountTo !== null
						? localDiscountTo.toISOString().slice(0, 10)
						: null,
				discountSize: hookFormData.discount ? hookFormData.discountSize : null,
				mainImage: mainImage,
				images: images,
				coverImage: coverImage,
				characteristics: characteristicsObject || {},
				hide: hookFormData.hide,
				publisherId: itemPublisher?.id || null,
				developersIds: itemDevelopers.map((developer) => developer.id),
				genresIds: itemGenres.map((genre) => genre.id),
			}).catch((err) => {
				if (err instanceof ClientError) error = err;
				if (err instanceof Error) error = new ClientError(500, err.message);
				error = new ClientError(500, "Помилка сервера");
			});
		}
		if (error && !result) {
			setAlert({
				severity: "error",
				message: error.message,
				title: `Помилка ${error.status}`,
			});
			setOpenDialog(true);
		}

		if (result) {
			setAlert({
				severity: "success",
				title: "Успіх",
				message: `Товар ${item ? "оновлено" : "створено"}`,
			});
			setOpenDialog(true);
		}
	};

	const onReset = () => {
		methods.reset();
		removeImages();
		removeMainImage();
		removeCoverImage();
	};

	return (
		<>
			<Box>
				<Typography variant='h4' textAlign='center' mb={3}>
					{item ? `Редагування товару ${item.name} (№${item.id})` : "Створення товару"}
				</Typography>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)} onReset={onReset}>
						<FormBox>
							<InputBox>
								<Typography variant='h6' component='label' htmlFor='name'>
									Назва
								</Typography>
								<Controller
									name='name'
									control={methods.control}
									render={({ field, formState: { errors } }) => (
										<TextField
											{...field}
											id='name'
											placeholder='Назва'
											required
											variant='outlined'
											error={!!errors.name}
											helperText={errors.name?.message}
										/>
									)}
								/>
							</InputBox>
							<InputBox>
								<Typography variant='h6' component='label' htmlFor='description'>
									Опис
								</Typography>
								<Controller
									name='description'
									control={methods.control}
									render={({ field, formState: { errors } }) => (
										<TextField
											{...field}
											id='description'
											placeholder='Опис'
											variant='outlined'
											multiline
											rows={4}
											error={!!errors.description}
											helperText={errors.description?.message}
										/>
									)}
								/>
							</InputBox>
							<InputBox>
								<Typography variant='h6' component='label' htmlFor='releaseDate'>
									Дата випуску
								</Typography>
								<Controller
									name='releaseDate'
									control={methods.control}
									render={({ field, formState: { errors } }) => (
										<TextField
											{...field}
											value={localReleaseDate?.toISOString().slice(0, 10) ?? ""}
											onChange={(e) => {
												const date = new Date(e.target.value);
												const offset = date.getTimezoneOffset();
												setLocalReleaseDate(new Date(date.getTime() - offset * 60 * 1000));
												field.onChange(e);
											}}
											id='releaseDate'
											placeholder='Дата випуску'
											required
											variant='outlined'
											type='date'
											error={!!errors.releaseDate}
											helperText={errors.releaseDate?.message}
											sx={{ width: "100%" }}
										/>
									)}
								/>
							</InputBox>
							<ResponsiveBox colsNum={2}>
								<InputBox>
									<Typography variant='h6' component='label' htmlFor='price'>
										Ціна
									</Typography>
									<Controller
										name='price'
										control={methods.control}
										render={({ field, formState: { errors } }) => (
											<TextField
												{...field}
												id='price'
												placeholder='Ціна'
												required
												variant='outlined'
												type='number'
												error={!!errors.price}
												helperText={errors.price?.message}
											/>
										)}
									/>
								</InputBox>
								<InputBox>
									<Typography variant='h6' component='label' htmlFor='amount'>
										Кількість
									</Typography>
									<Controller
										name='amount'
										control={methods.control}
										render={({ field, formState: { errors } }) => (
											<TextField
												{...field}
												id='amount'
												placeholder='Кількість'
												required
												variant='outlined'
												type='number'
												error={!!errors.amount}
												helperText={errors.amount?.message}
											/>
										)}
									/>
								</InputBox>
							</ResponsiveBox>
							<InputBox>
								<Typography variant='h6' component='label' htmlFor='genres'>
									Жанри
								</Typography>
								<Autocomplete
									id='genres'
									multiple
									options={Genres}
									value={itemGenres}
									filterSelectedOptions
									getOptionLabel={(option) => option.name}
									isOptionEqualToValue={(option, value) => option.id === value.id}
									onChange={(_, data: DataObject[]) => {
										setItemGenres(data);
									}}
									renderInput={(params) => (
										<TextField {...params} placeholder='Жанри' variant='outlined' />
									)}
									renderTags={(value, getTagProps) => {
										return value.map((option, index) => (
											<Chip
												{...getTagProps({ index })}
												key={index}
												label={<Typography variant='body2'>{option.name}</Typography>}
											/>
										));
									}}
								/>
							</InputBox>
							<InputBox>
								<Typography variant='h6' component='label' htmlFor='developers'>
									Розробники
								</Typography>
								<Autocomplete
									id='developers'
									multiple
									options={Companies}
									value={itemDevelopers}
									filterSelectedOptions
									getOptionLabel={(option) => option.name}
									isOptionEqualToValue={(option, value) => option.id === value.id}
									onChange={(_, data: DataObject[]) => {
										setItemDevelopers(data);
									}}
									renderInput={(params) => (
										<TextField {...params} placeholder='Розробники' variant='outlined' />
									)}
									renderTags={(value, getTagProps) => {
										return value.map((option, index) => (
											<Chip
												{...getTagProps({ index })}
												key={index}
												label={<Typography variant='body2'>{option.name}</Typography>}
											/>
										));
									}}
								/>
							</InputBox>
							<InputBox>
								<Typography variant='h6' component='label' htmlFor='publisher'>
									Видавець
								</Typography>
								<Autocomplete
									id='publisher'
									options={Companies}
									value={itemPublisher}
									getOptionLabel={(option) => option.name}
									isOptionEqualToValue={(option, value) => option.id === value.id}
									onChange={(_, data: DataObject | null) => {
										setItemPublisher(data);
									}}
									renderInput={(params) => (
										<TextField {...params} placeholder='Видавці' variant='outlined' />
									)}
									renderTags={(value, getTagProps) => {
										return value.map((option, index) => (
											<Chip
												{...getTagProps({ index })}
												key={index}
												label={<Typography variant='body2'>{option.name}</Typography>}
											/>
										));
									}}
								/>
							</InputBox>
							<Controller
								name='hide'
								control={methods.control}
								render={({ field }) => (
									<FormControlLabel
										control={<Checkbox {...field} id='hide' checked={Boolean(field.value)} />}
										label='Приховати'
									/>
								)}
							/>
							<Controller
								name='discount'
								control={methods.control}
								render={({ field }) => (
									<FormControlLabel
										control={<Checkbox {...field} id='discount' checked={Boolean(field.value)} />}
										label='Знижка'
									/>
								)}
							/>
							{methods.watch("discount") && (
								<>
									<InputBox>
										<Typography variant='h6' component='label' htmlFor='discountSize'>
											Розмір знижки
										</Typography>
										<Controller
											name='discountSize'
											control={methods.control}
											render={({ field, formState: { errors } }) => (
												<TextField
													{...field}
													id='discountSize'
													placeholder='Розмір знижки'
													variant='outlined'
													type='number'
													error={!!errors.discountSize}
													helperText={errors.discountSize?.message}
												/>
											)}
										/>
									</InputBox>
									<ResponsiveBox colsNum={2}>
										<InputBox>
											<Typography variant='h6' component='label' htmlFor='discountFrom'>
												Дата початку знижки
											</Typography>
											<Controller
												name='discountFrom'
												control={methods.control}
												render={({ field, formState: { errors } }) => (
													<TextField
														{...field}
														value={localDiscountFrom?.toISOString().slice(0, 10) ?? ""}
														onChange={(e) => {
															const date = new Date(e.target.value);
															const offset = date.getTimezoneOffset();
															setLocalDiscountFrom(
																new Date(date.getTime() - offset * 60 * 1000)
															);
															field.onChange(e);
														}}
														id='discountFrom'
														variant='outlined'
														type='date'
														error={!!errors.discountFrom}
														helperText={errors.discountFrom?.message}
														sx={{ width: "100%" }}
													/>
												)}
											/>
										</InputBox>
										<InputBox>
											<Typography variant='h6' component='label' htmlFor='discountTo'>
												Дата кінця знижки
											</Typography>
											<Controller
												name='discountTo'
												control={methods.control}
												render={({ field, formState: { errors } }) => (
													<TextField
														{...field}
														value={localDiscountTo?.toISOString().slice(0, 10) ?? ""}
														onChange={(e) => {
															const date = new Date(e.target.value);
															const offset = date.getTimezoneOffset();
															setLocalDiscountTo(
																new Date(date.getTime() - offset * 60 * 1000)
															);
															field.onChange(e);
														}}
														id='discountTo'
														variant='outlined'
														type='date'
														error={!!errors.discountTo}
														helperText={errors.discountTo?.message}
														sx={{ width: "100%" }}
													/>
												)}
											/>
										</InputBox>
									</ResponsiveBox>
								</>
							)}
							<Tooltip title='Форма запису: "назва_характеристики: характеристика;", розділення через ";" із новим рядком'>
								<InputBox>
									<Typography variant='h6' component='label' htmlFor='characteristics'>
										Характеристики *
									</Typography>
									<TextField
										id='characteristics'
										value={characteristics}
										placeholder='Характеристики'
										variant='outlined'
										multiline
										rows={4}
										onChange={(e) => {
											const data = e.target.value;
											setCharacteristics(data);
										}}
									/>
								</InputBox>
							</Tooltip>
							<ResponsiveBox colsNum={2}>
								<Box>
									<ButtonGroup fullWidth>
										<SubmitButton onClick={uploadMainImage} variant='contained'>
											Завантажити головне зображення
										</SubmitButton>
										<Button onClick={removeMainImage} variant='contained'>
											Видалити головне зображення
										</Button>
									</ButtonGroup>
									{mainImage && <Image src={mainImage} alt='mainImage' />}
								</Box>
								<Box>
									<ButtonGroup fullWidth>
										<SubmitButton onClick={uploadCoverImage} variant='contained'>
											Завантажити обкладинку
										</SubmitButton>
										<Button onClick={removeCoverImage} variant='contained'>
											Видалити обкладинку
										</Button>
									</ButtonGroup>
									{coverImage && <Image src={coverImage} alt='coverImage' />}
								</Box>
							</ResponsiveBox>
							<ButtonGroup fullWidth>
								<SubmitButton onClick={uploadImages} variant='contained'>
									Завантажити додаткові зображення
								</SubmitButton>
								<Button onClick={removeImages} variant='contained'>
									Видалити додаткові зображення
								</Button>
							</ButtonGroup>
							<ImagesGrid>
								{images.map((image, index) => (
									<ImageBox key={`image-${index}`}>
										<Image src={image} alt={`image-${index}`} />
										<IconButton onClick={() => removeImage(index)}>
											<Delete />
										</IconButton>
									</ImageBox>
								))}
							</ImagesGrid>
							<ButtonGroup fullWidth>
								<SubmitButton type='submit' variant='contained'>
									Зберегти
								</SubmitButton>
								<Button type='reset' variant='contained'>
									Скинути
								</Button>
							</ButtonGroup>
						</FormBox>
					</form>
				</FormProvider>
			</Box>
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<Alert severity={alert.severity}>
					<AlertTitle>{alert.title}</AlertTitle>
					{alert.message}
				</Alert>
			</Dialog>
		</>
	);
}
