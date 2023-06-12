import { CreateGenreRequest, Genre, UpdateGenreRequest } from "../../http/Genres";
import ClientError from "../../ClientError";
import { useLoaderData } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Alert, AlertColor, AlertTitle, Box, Button, ButtonGroup, Dialog, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import SubmitButton from "../../components/Common/SubmitButton";
import { useState } from "react";
import { Item } from "../../http/Items";
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

export default function AdminGenreForm() {
	const { genre, error } = useLoaderData() as {
		genre?: Genre & {
			Items?: Item[];
		};
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
		(genre ? `Редагування жанру ${genre.name} (№${genre.id})` : "Створення жанру") +
		" — Адміністративна панель — gigashop";

	type GenreForm = {
		name: string;
		description: string;
	};
	let defaultValues: Genre | GenreForm = {
		name: "",
		description: "",
	};
	if (genre) defaultValues = genre;

	const methods = useForm({
		defaultValues,
	});

	const onSubmit = async (data: any) => {
		console.log(data);
		const token = Cookies.get("token");
		if (!token) throw new ClientError(403, "Ви не авторизовані");

		let result: Genre | void;
		let error: ClientError | undefined;
		if (genre) {
			result = await UpdateGenreRequest(token, genre.id, {
				name: data.name,
				description: data.description,
			}).catch((err) => {
				if (err instanceof ClientError) throw err;
				if (err instanceof Error) throw new ClientError(500, err.message);
				error = err;
			});
		} else {
			result = await CreateGenreRequest(token, { name: data.name, description: data.description }).catch(
				(err) => {
					if (err instanceof ClientError) throw err;
					if (err instanceof Error) throw new ClientError(500, err.message);
					error = err;
				}
			);
		}
		if (error) {
			setAlert({
				title: "Помилка",
				message: error.message,
				severity: "error",
			});
			setOpenDialog(true);
		}

		if (result) {
			setAlert({
				title: "Успіх",
				message: `Жанр ${result.name} (№${result.id}) успішно ${genre ? "оновлено" : "створено"}`,
				severity: "success",
			});
			setOpenDialog(true);
		}
	};

	const onReset = () => {
		methods.reset();
	};

	return (
		<>
			<Box>
				<Typography variant='h4' textAlign='center' mb={3}>
					{genre ? `Редагування жанру ${genre.name} (№${genre.id})` : "Створення жанру"}
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
											variant='outlined'
											fullWidth
											required
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
											fullWidth
											multiline
											rows={4}
											error={!!errors.description}
											helperText={errors.description?.message}
										/>
									)}
								/>
							</InputBox>
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
