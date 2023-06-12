import { useLoaderData } from "react-router-dom";
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from "../../http/Companies";
import ClientError from "../../ClientError";
import { Controller, FormProvider, useForm } from "react-hook-form";
import WidgetSingle from "../../Cloudinary/WidgetSingle";
import { Alert, AlertColor, AlertTitle, Box, Button, ButtonGroup, Dialog, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import { useState } from "react";
import SubmitButton from "../../components/Common/SubmitButton";
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

	const [alert, setAlert] = useState<{
		title: string;
		message: string;
		severity: AlertColor | undefined;
	}>({ title: "", message: "", severity: undefined });
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
	let defaultValues: CompanyForm = {
		name: "",
		description: "",
		director: "",
		founded: undefined,
	};
	if (company)
		defaultValues = {
			name: company.name,
			description: company.description,
			director: company.director,
			founded: new Date(company.founded),
		};

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

	const onSubmit = async (hookFormData: any) => {
		const token = Cookies.get("token");
		if (!token) throw new ClientError(403, "Ви не авторизовані");

		let result: Company | void;
		let error: ClientError | undefined;
		if (company) {
			const date = hookFormData.founded instanceof Date ? hookFormData.founded : new Date(hookFormData.founded);

			result = await UpdateCompanyRequest(token, company.id, {
				name: hookFormData.name,
				description: hookFormData.description,
				director: hookFormData.director,
				image: image !== null ? image : company.image,
				founded: date.toISOString().slice(0, 10),
			}).catch((err) => {
				if (err instanceof ClientError) error = err;
				if (err instanceof Error) error = new ClientError(500, err.message);
				error = new ClientError(500, "Помилка сервера");
			});
		} else {
			if (image === null) {
				setAlert({
					severity: "error",
					message: "Ви не завантажили зображення",
					title: "Помилка",
				});
				setOpenDialog(true);
				return;
			}

			if (!hookFormData.founded || hookFormData.founded === null) {
				setAlert({
					severity: "error",
					message: "Ви не вказали дату заснування",
					title: "Помилка",
				});
				setOpenDialog(true);
				return;
			}

			if (!hookFormData.name || hookFormData.name.length === 0) {
				setAlert({
					severity: "error",
					message: "Ви не вказали назву компанії",
					title: "Помилка",
				});
				setOpenDialog(true);
				return;
			}

			if (!hookFormData.director || hookFormData.director.length === 0) {
				setAlert({
					severity: "error",
					message: "Ви не вказали директора компанії",
					title: "Помилка",
				});
				setOpenDialog(true);
				return;
			}

			const date = hookFormData.founded instanceof Date ? hookFormData.founded : new Date(hookFormData.founded);

			result = await CreateCompanyRequest(token, {
				name: hookFormData.name,
				description: hookFormData.description,
				director: hookFormData.director,
				image: image,
				founded: date.toISOString().slice(0, 10),
				hide: false,
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
				message: `Компанію ${result.name} (№${result.id}) ${company ? "оновлено" : "створено"}`,
				title: "Успіх",
			});
			setOpenDialog(true);
		}
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
				<Alert severity={alert.severity}>
					<AlertTitle>{alert.title}</AlertTitle>
					{alert.message}
				</Alert>
			</Dialog>
		</>
	);
}
