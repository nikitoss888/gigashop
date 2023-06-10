import { Container, Typography } from "@mui/material";
import { User } from "../mock/Users";
import { useLoaderData } from "react-router-dom";

export default function CartSuccess() {
	const { user } = useLoaderData() as {
		user: User;
	};

	return (
		<Container sx={{ marginTop: "15px", height: "100%" }}>
			<Typography variant='h3' textAlign='center' mt={3}>
				Вітаємо з придбанням!
			</Typography>
			<Typography variant='h5' textAlign='center' mt={3}>
				Ваше замовлення успішно оформлено!
			</Typography>
			<Typography variant='h5' textAlign='center' mt={3}>
				Дякуємо за покупку, {user.login}! Пропонуємо Вам ознайомитися з іншими нашими товарами.
			</Typography>
		</Container>
	);
}
