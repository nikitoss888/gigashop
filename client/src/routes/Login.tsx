import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Alert, AlertColor, AlertTitle, Box, ButtonGroup, Container, Dialog, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styled from "@mui/material/styles/styled";
import SubmitButton from "../components/Common/SubmitButton";
import { LogInRequest } from "../http/User";
import { useRecoilState } from "recoil";
import { LogIn, userState } from "../store/User";
import { useNavigate } from "react-router-dom";
import ClientError from "../ClientError";
import { useState } from "react";
import { AxiosError } from "axios";

const schema = yup.object().shape({
	login: yup
		.string()
		.min(4, "Логін має містити не менше 4 символів")
		.max(20, "Логін має містити не більше 20 символів")
		.matches(/^[a-zA-Z0-9]+$/, "Логін має містити тільки латинські літери та цифри")
		.required("Логін є обов'язковим полем"),
	password: yup
		.string()
		.min(6, "Пароль має містити не менше 6 символів")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
			"Пароль має містити хоча б одну велику літеру, одну маленьку літеру та одну цифру"
		),
});

const BoxStyle = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 1rem;
`;

const InputBoxStyle = styled(Box)`
	display: flex;
	flex-direction: column;
	"Typography" {
		margin-bottom: 0.5rem;
	}
`;

export default function Login() {
	document.title = "Вхід — gigashop";
	const [user, setUser] = useRecoilState(userState);
	const navigate = useNavigate();

	if (user) {
		navigate("/");
	}

	const methods = useForm({
		resolver: yupResolver(schema),
	});

	const [alert, setAlert] = useState<{
		title: string;
		message: string;
		severity: AlertColor | undefined;
	}>({ title: "", message: "", severity: undefined });
	const [openDialog, setOpenDialog] = useState(false);

	const onSubmit = async (data: any) => {
		const result = await LogInRequest(data.login, data.password).catch((err) => {
			console.log({
				err,
				isClientError: err instanceof ClientError,
				isError: err instanceof Error,
				isAxiosError: err instanceof AxiosError,
			});
			if (err instanceof ClientError) return err;
			if (err instanceof AxiosError) {
				console.log("AxiosError");
				let status: string | number = 500;
				let message = "Помилка сервера";

				if (err.response && err.response.data) {
					console.log({ response: err.response, data: err.response.data });
					status = err.response.status;
					message = err.response.data ? err.response.data.message : message;
				}
				return new ClientError(status, message);
			}
			if (err instanceof Error) return new ClientError(500, "Помилка сервера: " + err.message);
			return new ClientError(500, "Помилка сервера");
		});
		console.log({ result });

		if (result instanceof ClientError) {
			setAlert({
				title: "Помилка",
				message: result.message,
				severity: "error",
			});
			setOpenDialog(true);
			return;
		}

		if (result.token) {
			const logInResult = LogIn(setUser, result.token);
			if (!logInResult) throw new ClientError(500, "Помилка авторизації");
			navigate(-1);
		}
	};

	const onReset = () => {
		methods.reset();
	};

	return (
		<>
			<Container maxWidth='sm'>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)} onReset={onReset}>
						<BoxStyle>
							<InputBoxStyle>
								<Typography variant='h6' component='h2'>
									Логін
								</Typography>
								<Controller
									name='login'
									control={methods.control}
									defaultValue=''
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...field}
											placeholder='Логін'
											variant='outlined'
											fullWidth
											error={!!error}
											helperText={error?.message || null}
										/>
									)}
								/>
							</InputBoxStyle>
							<InputBoxStyle>
								<Typography variant='h6' component='h2'>
									Пароль
								</Typography>
								<Controller
									name='password'
									control={methods.control}
									defaultValue=''
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...field}
											placeholder='Пароль'
											variant='outlined'
											fullWidth
											error={!!error}
											type='password'
											helperText={error?.message || null}
										/>
									)}
								/>
							</InputBoxStyle>
							<ButtonGroup fullWidth>
								<SubmitButton type='submit' variant='contained'>
									Відправити
								</SubmitButton>
								<Button type='reset' variant='contained'>
									Очистити
								</Button>
							</ButtonGroup>
						</BoxStyle>
					</form>
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
