import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import ClientError from "../ClientError";
import { useErrorBoundary } from "react-error-boundary";

const ErrorWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 15px;
`;

type ErrorPageProps = {
	error?: Error | ClientError;
};
export default function ErrorPage({ error }: ErrorPageProps) {
	const { resetBoundary } = useErrorBoundary();
	const navigate = useNavigate();
	if (process.env.NODE_ENV !== "production") console.error(error);

	const name = error ? error.name : "500";
	const message = error ? error.message : "Невідома помилка";
	let title;
	switch (name) {
		case "400":
			title = "Невірний запит!";
			break;
		case "401":
			title = "Необхідна авторизація!";
			break;
		case "404":
			title = "Сторінку не знайдено!";
			break;
		case "403":
			title = "Доступ заборонено!";
			break;
		case "500":
		default:
			title = "Щось пішло не так...";
	}

	return (
		<ErrorWrapper>
			<Typography variant='h2'>{title}</Typography>
			<Typography variant='h3'>Помилка {name}</Typography>
			<Typography variant='h4'>{message}</Typography>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: "15px",
				}}
			>
				<Button
					variant='contained'
					sx={{
						backgroundColor: "accent.main",
						color: "secondary.main",
						"&:hover": {
							backgroundColor: "accent.main",
						},
					}}
					onClick={() => {
						resetBoundary();
						navigate(-1);
					}}
				>
					{location.pathname === "/" ? "На головну" : "Назад"}
				</Button>
				{name === "401" && (
					<Button
						variant='contained'
						sx={{
							backgroundColor: "accent.main",
							color: "secondary.main",
							"&:hover": {
								backgroundColor: "accent.main",
							},
						}}
						onClick={() => {
							resetBoundary();
							navigate("/login");
						}}
					>
						Увійти
					</Button>
				)}
			</Box>
		</ErrorWrapper>
	);
}
