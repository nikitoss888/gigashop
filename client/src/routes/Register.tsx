import WidgetSingle from "../Cloudinary/WidgetSingle";
import { useState } from "react";
import { Alert, AlertColor, AlertTitle, Box, Button, ButtonGroup, Container, Dialog, TextField } from "@mui/material";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SubmitButton from "../components/Common/SubmitButton";
import { RegisterRequest } from "../http/User";
import { LogIn, userState } from "../store/User";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import ClientError from "../ClientError";
import { AxiosError } from "axios";

const schema = yup.object().shape({
	login: yup
		.string()
		.min(4, "Логін має містити не менше 4 символів")
		.max(20, "Логін має містити не більше 20 символів")
		.matches(/^[a-zA-Z0-9]+$/, "Логін має містити тільки латинські літери та цифри")
		.required("Логін є обов'язковим полем"),
	email: yup.string().email("Невірний формат пошти").required("Пошта є обов'язковим полем"),
	password: yup
		.string()
		.min(6, "Пароль має містити не менше 6 символів")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
			"Пароль має містити хоча б одну велику літеру, одну маленьку літеру та одну цифру"
		),
	confirmPassword: yup.string().oneOf([yup.ref("password"), undefined], "Паролі мають співпадати"),
	firstName: yup
		.string()
		.min(2, "Ім'я має містити не менше 2 символів")
		.max(20, "Ім'я має містити не більше 20 символів")
		.matches(
			/^[A-Z][a-zA-Z\-']+$|^[А-ЯЄЇІҐ][а-яА-ЯЄєЇїІіҐґ\-']+$/,
			"Ім'я має починатися з великої літери та містити тільки кириличні літери"
		),
	lastName: yup
		.string()
		.min(2, "Прізвище має містити не менше 2 символів")
		.max(20, "Прізвище має містити не більше 20 символів")
		.matches(
			/^[A-Z][a-zA-Z\-']+$|^[А-ЯЄЇІҐ][а-яА-ЯЄєЇїІіҐґ\-']+$/,
			"Прізвище має починатися з великої літери та містити тільки кириличні літери"
		),
});

const Form = styled("form")`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
`;

const UploadButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.secondary};
	&:hover {
		background-color: ${(props) => props.theme.colors.accentLight};
	}
` as typeof Button;

const ImagePreview = styled("img")`
	width: 100%;
	height: auto;
`;

export default function Register() {
	document.title = "Реєстрація — gigashop";
	const [user, setUser] = useRecoilState(userState);
	const navigate = useNavigate();

	if (user) {
		navigate("/");
	}

	const [image, setImage] = useState<string | null>(null);
	const { widgetRef } = WidgetSingle("dnqlgypji", "gigashop_users", setImage);

	const methods = useForm({
		resolver: yupResolver(schema),
	});

	const uploadImage = () => {
		widgetRef.current.open();
	};

	const unsetImage = () => {
		setImage(null);
	};

	const [alert, setAlert] = useState<{
		title: string;
		message: string;
		severity: AlertColor | undefined;
	}>({ title: "", message: "", severity: undefined });
	const [openDialog, setOpenDialog] = useState(false);

	const onSubmit = async (data: any) => {
		const localImage = image || (process.env.REACT_APP_DEFAULT_USER_IMAGE as string);
		const result = await RegisterRequest({
			login: data.login,
			email: data.email,
			password: data.password,
			firstName: data.firstName,
			lastName: data.lastName,
			image: localImage,
		}).catch((e) => {
			console.log(e);
			if (e instanceof AxiosError) {
				let response;
				let status: string | number = 500;
				let message = "Помилка реєстрації";

				if (e.response) response = e.response;

				if (response && response.data) {
					message = response.data.message ? response.data.message : message;
					status = response.status ? response.status : status;
				}

				return new ClientError(status, message);
			}
			if (e instanceof ClientError) {
				return e;
			}
			return new ClientError(500, "Помилка реєстрації");
		});
		if (result instanceof ClientError) {
			setAlert({
				title: "Помилка",
				message: result.message,
				severity: "error",
			});
			setOpenDialog(true);
			return;
		}

		const logInResult = LogIn(setUser, result.token);
		if (!logInResult) throw new ClientError(500, "Помилка авторизації");
		navigate("/");
	};

	const onReset = () => {
		methods.reset();
		unsetImage();
	};

	return (
		<>
			<Container
				sx={{
					height: "100%",
					mt: "15px",
				}}
			>
				<Typography variant='h4' textAlign='center' my={3}>
					Реєстрація
				</Typography>
				<FormProvider {...methods}>
					<Form onSubmit={methods.handleSubmit(onSubmit)} onReset={onReset}>
						<Box
							sx={{
								gridColumn: "1 / 3",
								display: "flex",
								flexDirection: "row",
								alignItems: "start",
								justifyContent: "stretch",
								gap: "20px",
							}}
						>
							<Box width='100%'>
								<Typography variant='h6'>Ім&apos;я</Typography>
								<Controller
									name='firstName'
									control={methods.control}
									defaultValue=''
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...field}
											placeholder='Тарас'
											variant='outlined'
											fullWidth
											error={!!error}
											helperText={error ? error.message : null}
										/>
									)}
								/>
							</Box>
							<Box width='100%'>
								<Typography variant='h6'>Прізвище</Typography>
								<Controller
									name='lastName'
									control={methods.control}
									defaultValue=''
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...field}
											placeholder='Шевченко'
											variant='outlined'
											fullWidth
											error={!!error}
											helperText={error ? error.message : null}
										/>
									)}
								/>
							</Box>
						</Box>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "start",
								gap: "1rem",
								gridColumn: "1 / 2",
								gridRow: "2 / 6",
							}}
						>
							<Typography variant='h6'>Завантажити зображення</Typography>
							<ButtonGroup fullWidth>
								<UploadButton onClick={uploadImage} variant='contained'>
									Завантажити
								</UploadButton>
								<Button onClick={unsetImage} variant='contained'>
									Очистити
								</Button>
							</ButtonGroup>
							{image && <ImagePreview src={image} />}
						</Box>
						<Box
							sx={{
								gridColumn: "2 / 3",
								display: "flex",
								flexDirection: "column",
								gap: "10px",
							}}
						>
							<Box width='100%'>
								<Typography variant='h6'>Пошта</Typography>
								<Controller
									name='email'
									control={methods.control}
									defaultValue=''
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...field}
											placeholder='qwerty@mail.com'
											variant='outlined'
											fullWidth
											error={!!error}
											helperText={error ? error.message : null}
										/>
									)}
								/>
							</Box>
							<Box width='100%'>
								<Typography variant='h6'>Логін</Typography>
								<Controller
									name='login'
									control={methods.control}
									defaultValue=''
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...field}
											placeholder='Qw3rty'
											variant='outlined'
											fullWidth
											error={!!error}
											helperText={error ? error.message : null}
										/>
									)}
								/>
							</Box>
							<Box>
								<Typography variant='h6'>Пароль</Typography>
								<Controller
									name='password'
									control={methods.control}
									defaultValue=''
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...field}
											placeholder='Qwerty12345'
											variant='outlined'
											fullWidth
											type='password'
											error={!!error}
											helperText={error ? error.message : null}
										/>
									)}
								/>
							</Box>
							<Box>
								<Typography variant='h6'>Повторіть пароль</Typography>
								<Controller
									name='confirmPassword'
									control={methods.control}
									defaultValue=''
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...field}
											placeholder='Qwerty12345'
											variant='outlined'
											fullWidth
											type='password'
											error={!!error}
											helperText={error ? error.message : null}
										/>
									)}
								/>
							</Box>
						</Box>
						<ButtonGroup
							sx={{
								gridColumn: "1 / -1",
							}}
							fullWidth
						>
							<SubmitButton type='submit' variant='contained'>
								Відправити
							</SubmitButton>
							<Button type='reset' variant='contained'>
								Очистити
							</Button>
						</ButtonGroup>
					</Form>
				</FormProvider>
			</Container>
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<Alert severity={alert.severity}>
					<AlertTitle>{alert.title}</AlertTitle>
					{alert.message}
				</Alert>
			</Dialog>
		</>
	);
}
