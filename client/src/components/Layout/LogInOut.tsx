import styled from "@mui/material/styles/styled";
import { useRecoilState } from "recoil";
import { LogIn, LogOut, userState } from "../../store/User";
import { LogInRequest } from "../../http/User";
import { useState } from "react";
import { Box, Button as MUIButton, Typography, Modal, TextField } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { useTheme } from "@mui/material/styles";

const LogIOBtn = styled(MUIButton)`
	margin-left: auto;
`;

const LogOutBox = styled(Box)`
	margin-left: auto;
	display: flex;

	${LogIOBtn} {
		margin-left: 25px;
	}
`;

const SendButton = styled(MUIButton)`
	background-color: ${(props) => props.theme.colors.accent};
`;

export default function LogInOut() {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const [user, setUser] = useRecoilState(userState);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [password, setPassword] = useState("");
	const [credentials, setCredentials] = useState("");

	const theme = useTheme();

	const handleLogOut = () => {
		LogOut(setUser);
		return;
	};

	const handleLogIn = async () => {
		let errorMessage: string | undefined;
		const response = await LogInRequest(credentials, password).catch((err) => {
			errorMessage = err.response.data.message;
		});

		if (errorMessage) {
			setError(errorMessage);
			return;
		}
		let result: unknown;
		if (response) result = LogIn(setUser, response.data.token);
		if (result) handleClose();
	};

	return (
		<>
			{user ? (
				<LogOutBox>
					<Typography variant='h6' color='secondary'>
						{user.login}
					</Typography>
					<LogIOBtn variant='contained' onClick={handleLogOut}>
						Вийти
					</LogIOBtn>
				</LogOutBox>
			) : (
				<>
					<LogIOBtn variant='contained' onClick={handleOpen}>
						Увійти
					</LogIOBtn>

					<ThemeProvider theme={theme}>
						<Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title'>
							<Box
								bgcolor='primary.main'
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									gap: "10px",
									width: "400px",
									padding: "25px",
									borderRadius: "10px",
									marginInline: "auto",
									marginTop: "15%",
								}}
							>
								<Typography
									variant='h6'
									component='div'
									sx={{ flexGrow: 1, textAlign: "center" }}
									color='secondary'
								>
									Вхід в обліковий запис
								</Typography>

								<TextField
									label='Логін або пошта'
									placeholder='Qwerty123 або email@mail.com'
									variant='filled'
									onChange={(e) => setCredentials(e.target.value)}
								/>
								<TextField
									label='Пароль'
									placeholder='Qwerty123'
									variant='filled'
									type='password'
									onChange={(e) => setPassword(e.target.value)}
								/>

								{error && (
									<Typography variant='body1' color='error'>
										{error}
									</Typography>
								)}

								<SendButton variant='contained' onClick={handleLogIn}>
									Увійти
								</SendButton>
							</Box>
						</Modal>
					</ThemeProvider>
				</>
			)}
		</>
	);
}
