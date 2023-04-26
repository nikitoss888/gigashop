import { Link, useRouteError, isRouteErrorResponse, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { AdminTheme, RegularTheme } from "../styles";
import { Box } from "@mui/material";

const ErrorWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

export default function ErrorPage() {
	const error = useRouteError();
	const isRouteError = isRouteErrorResponse(error);
	if (process.env.NODE_ENV !== "production") console.error(error);

	const location = useLocation();
	const admin = location.pathname.startsWith("/admin");
	const theme = admin ? AdminTheme : RegularTheme;

	return (
		<ThemeProvider theme={theme}>
			<ErrorWrapper
				border={{ xs: 1, sm: 2 }}
				boxShadow={2}
				borderRadius={2}
				p={2}
				bgcolor='primary'
				color='secondary'
			>
				<Typography variant='h1'>Щось пішло не так...</Typography>
				<Typography variant='h2'>Помилка {isRouteError ? error.status : "500"}</Typography>
				<Typography variant='h3'>Повідомлення: {isRouteError ? error.data : "Невідома помилка"}</Typography>
				<Button variant='contained' color='primary' component={Link} to='/'>
					На головну
				</Button>
			</ErrorWrapper>
		</ThemeProvider>
	);
}
