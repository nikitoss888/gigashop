import { Genre } from "../../mock/Genres";
import ClientError from "../../ClientError";
import { useLoaderData } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Alert, AlertTitle, Box, Button, ButtonGroup, Dialog, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import SubmitButton from "../../components/Common/SubmitButton";
import { useState } from "react";

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
		genre?: Genre;
		error?: ClientError;
	};

	if (error) throw error;

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

	const onSubmit = (data: any) => {
		console.log(data);
		setOpenDialog(true);
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
				<Alert severity='success' onClose={() => setOpenDialog(false)}>
					<AlertTitle>Успіх</AlertTitle>
					Жанр успішно {genre ? "оновлено" : "створено"}!
				</Alert>
			</Dialog>
		</>
	);
}
