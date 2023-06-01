import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

const ErrorWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 15px;
`;

type ErrorPageProps = {
	error?: Error;
	resetErrorBoundary?: () => void;
};
export default function ErrorPage({ error, resetErrorBoundary }: ErrorPageProps = {}) {
	const navigate = useNavigate();
	if (process.env.NODE_ENV !== "production") console.error(error);

	const name = error ? error.name : "500";
	const message = error ? error.message : "Невідома помилка";
	let title;
	switch (name) {
		case "400":
			title = "Невірний запит!";
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
					resetErrorBoundary?.();
					navigate(-1);
				}}
			>
				{location.pathname === "/" ? "На головну" : "Назад"}
			</Button>
		</ErrorWrapper>
	);
}
