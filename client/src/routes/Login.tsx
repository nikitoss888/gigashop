import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Box, ButtonGroup, Container, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styled from "@mui/material/styles/styled";
import SubmitButton from "../components/Common/SubmitButton";
import { LogInRequest } from "../http/User";
import { useRecoilState } from "recoil";
import { LogIn, userState } from "../store/User";
import { useNavigate } from "react-router-dom";
import ClientError from "../ClientError";

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
	const [user, setUser] = useRecoilState(userState);
	const navigate = useNavigate();

	if (user) {
		navigate("/");
	}

	const methods = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data: any) => {
		const result = await LogInRequest(data.login, data.password);
		if (result && result.data.token) {
			try {
				const logInResult = LogIn(setUser, result.data.token);
				if (!logInResult) throw new ClientError(500, "Помилка авторизації");
				navigate(-1);
			} catch (e: unknown) {
				if (e instanceof Error) {
					throw new ClientError(500, e.message);
				}
				if (e instanceof ClientError) {
					throw e;
				}
				console.error(e);
			}
		}
	};

	const onReset = () => {
		methods.reset();
	};

	return (
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
	);
}
