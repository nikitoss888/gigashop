import { Container, Typography } from "@mui/material";
import { User } from "../http/User";
import { useLoaderData } from "react-router-dom";
import { ItemCart } from "../http/Items";
import ClientError from "../ClientError";

export default function CartSuccess() {
	const { user, cart, error } = useLoaderData() as {
		user: User;
		cart?: ItemCart[];
		error?: ClientError;
	};
	if (error) throw error;
	if (cart && cart.length > 0) {
		throw new ClientError(403, "Ваш кошик не пустий");
	}

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
