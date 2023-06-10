import { useLoaderData } from "react-router-dom";
import { User } from "../mock/Users";
import { calculateDiscount, Item } from "../mock/Items";
import { useState } from "react";
import { Box, Container, Divider, List, Typography } from "@mui/material";
import CartItem from "../components/Cart/CartItem";
import Button from "@mui/material/Button";
import { LiqPayPay } from "react-liqpay";
import { v4 as uuidv4 } from "uuid";

export default function Cart() {
	document.title = "Кошик — gigashop";
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

	const onReset = () => {
		setCartState([]);
	};

	const publicKey = process.env.REACT_APP_LIQPAY_TEST_PUBLIC_KEY || "";
	const privateKey = process.env.REACT_APP_LIQPAY_TEST_PRIVATE_KEY || "";
	const amount = total.toString();
	const currency = "UAH";
	const description = "Оплата товарів";
	const transactionId = uuidv4();
	const result_url = (process.env.REACT_APP_NGROK_CLIENT_URL || "http://localhost:3000") + "/cart/success";
	const server_url =
		(process.env.REACT_APP_NGROK_SERVER_URL || "http://localhost:5000") + `/api/user/cart/success/${transactionId}`;
	const product_description = "Відеоігри та/або контент до них";

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
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							gap: "30px",
						}}
					>
						<LiqPayPay
							publicKey={publicKey}
							privateKey={privateKey}
							amount={amount}
							description={description}
							currency={currency}
							orderId={transactionId}
							result_url={result_url}
							server_url={server_url}
							product_description={product_description}
							title='Оплатити'
						/>
						<Button onClick={onReset}>Очистити корзину</Button>
					</Box>
				</>
			) : (
				<Typography variant='h5' textAlign='center' mt={3}>
					Корзина порожня
				</Typography>
			)}
		</Container>
	);
}
