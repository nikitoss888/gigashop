import { useLoaderData } from "react-router-dom";
import { User } from "../mock/Users";
import { calculateDiscount, Item } from "../mock/Items";
import { useState } from "react";
import { ButtonGroup, Container, Divider, List, Typography } from "@mui/material";
import CartItem from "../components/Cart/CartItem";
import Button from "@mui/material/Button";
import SubmitButton from "../components/Common/SubmitButton";

export default function Cart() {
	const { user, cart } = useLoaderData() as {
		user: User;
		cart: Item[];
	};
	const [cartState, setCartState] = useState(cart);
	const removeFromCart = (itemId: number) => {
		setCartState(cartState.filter((cartItem) => cartItem.id !== itemId));
	};

	const total = cartState.reduce((sum, item) => {
		const { finalPrice } = calculateDiscount(item);
		return sum + finalPrice;
	}, 0);

	const onSubmit = () => {
		console.log({ cartState, total });
	};

	const onReset = () => {
		setCartState([]);
	};

	return (
		<Container sx={{ marginTop: "15px", height: "100%" }}>
			<Typography variant='h3' textAlign='center' mt={3}>
				Корзина користувача {user.login}
			</Typography>
			{cartState.length > 0 ? (
				<>
					<List
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "stretch",
							gap: "10px",
						}}
					>
						{cartState.map((item, index) => (
							<>
								<CartItem item={item} deleteItem={removeFromCart} key={item.id.toString(16)} />
								{index < cartState.length - 1 && (
									<Divider
										key={`divider-${item.id.toString(16)}`}
										sx={{ borderColor: "primary.main" }}
									/>
								)}
							</>
						))}
					</List>
					<Typography variant='h5' textAlign='center' my={3}>
						Загальна вартість: {total} грн
					</Typography>
					<ButtonGroup variant='contained' fullWidth>
						<SubmitButton onClick={onSubmit}>Оплатити</SubmitButton>
						<Button onClick={onReset}>Очистити корзину</Button>
					</ButtonGroup>
				</>
			) : (
				<Typography variant='h5' textAlign='center' mt={3}>
					Корзина порожня
				</Typography>
			)}
		</Container>
	);
}
