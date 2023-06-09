import { useLoaderData } from "react-router-dom";
import { Company } from "../../mock/Companies";
import ClientError from "../../ClientError";
import { Controller, FormProvider, useForm } from "react-hook-form";
import WidgetSingle from "../../Cloudinary/WidgetSingle";
import { Alert, AlertTitle, Box, Button, ButtonGroup, Dialog, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import { useState } from "react";
import SubmitButton from "../../components/Common/SubmitButton";

const FormBox = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: 2rem;
`;

const InputBox = styled(Box)`
	display: flex;
	flex-direction: column;
`;

const Image = styled("img")`
	max-width: 300px;
	object-fit: contain;
`;

export default function AdminCompanyForm() {
	const { company, error } = useLoaderData() as {
		company?: Company;
		error?: ClientError;
	};

	if (error) throw error;

	const [openDialog, setOpenDialog] = useState(false);

	document.title =
		(company ? `Редагування компанії ${company.name} (№${company.id})` : "Створення компанії") +
		" — Адміністративна панель — gigashop";

	type CompanyForm = {
		name: string;
		description: string;
		director: string;
		founded: Date | undefined;
	};
	let defaultValues: Company | CompanyForm = {
		name: "",
		description: "",
		director: "",
		founded: undefined,
	};
	if (company) defaultValues = company;

	const methods = useForm({
		defaultValues,
	});

	const [image, setImage] = useState<string | null>(company?.image || null);
	const { widgetRef } = WidgetSingle("dnqlgypji", "gigashop_companies", setImage);

	const uploadImage = () => {
		widgetRef.current?.open();
	};
	const removeImage = () => {
		setImage(null);
	};

	const onSubmit = (hookFormData: any) => {
		console.log({ ...hookFormData, image });
		setOpenDialog(true);
	};
	const onReset = () => {
		methods.reset();
		removeImage();
	};

	return (
		<>
			<Box>
				<Typography variant='h4' textAlign='center' mb={3}>
					{company ? `Редагування компанії ${company.name} (№${company.id})` : "Створення компанії"}
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
											error={!!errors.name}
											helperText={errors.name?.message}
										/>
									)}
								/>
							</InputBox>
							<InputBox>
								<Typography variant='h6' component='label' htmlFor='director'>
									Директор
								</Typography>
								<Controller
									name='director'
									control={methods.control}
									render={({ field, formState: { errors } }) => (
										<TextField
											{...field}
											id='director'
											placeholder='Директор'
											variant='outlined'
											error={!!errors.director}
											helperText={errors.director?.message}
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
											minRows={4}
											error={!!errors.description}
											helperText={errors.description?.message}
										/>
									)}
								/>
							</InputBox>
							<ButtonGroup fullWidth>
								<SubmitButton onClick={uploadImage} variant='contained'>
									Завантажити зображення
								</SubmitButton>
								<Button onClick={removeImage} variant='contained'>
									Видалити зображення
								</Button>
							</ButtonGroup>
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								{image && <Image src={image} alt='image' />}
							</Box>
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
				<Alert severity='success'>
					<AlertTitle>Успіх</AlertTitle>
					Компанію успішно {company ? "оновлено" : "створено"}!
				</Alert>
			</Dialog>
		</>
	);
}
