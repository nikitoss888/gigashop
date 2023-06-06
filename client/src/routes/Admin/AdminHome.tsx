import { Box, Typography } from "@mui/material";

export default function AdminHome() {
	return (
		<Box sx={{ height: "100%" }}>
			<Typography variant='h4' textAlign='center'>
				Головна
			</Typography>
			<Typography variant='h5' textAlign='center'>
				Вітаємо в адміністративній панелі
			</Typography>
			<Typography variant='h5' textAlign='center'>
				Виберіть потрібний пункт меню
			</Typography>
		</Box>
	);
}
