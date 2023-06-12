import { useLoaderData } from "react-router-dom";
import { ClearCartRequest, User } from "../http/User";
import { calculateDiscount, Item } from "../http/Items";
import { useState } from "react";
import { Box, Container, Divider, List, Typography } from "@mui/material";
import CartItem from "../components/Cart/CartItem";
import Button from "@mui/material/Button";
import { LiqPayPay } from "react-liqpay";
import Cookies from "js-cookie";
import ClientError from "../ClientError";

export default function Cart() {
	document.title = "Кошик — gigashop";
	const { user, cart, error, transactionId } = useLoaderData() as {
		user?: User;
		cart?: Item[];
		transactionId: string;
		error?: ClientError;
	};

	if (!user) throw new ClientError(401, "Необхідно авторизуватися");
	if (error) throw error;

	const [cartState, setCartState] = useState(cart || []);
	const removeFromCart = (itemId: number) => {
		setCartState(cartState.filter((cartItem) => cartItem.id !== itemId));
	};

	const total = cartState.reduce((sum, item) => {
		const { finalPrice } = calculateDiscount(item);
		return sum + finalPrice;
	}, 0);

	const onReset = async () => {
		const token = Cookies.get("token");
		if (!token) throw new ClientError(401, "Необхідно авторизуватися");

		const result = await ClearCartRequest(token).catch((error) => {
			if (error instanceof ClientError) return error;
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) throw result;

		if (result.ok) setCartState([]);
	};

	const publicKey = process.env.REACT_APP_LIQPAY_TEST_PUBLIC_KEY || "";
	const privateKey = process.env.REACT_APP_LIQPAY_TEST_PRIVATE_KEY || "";
	const amount = total.toString();
	const currency = "UAH";
	const description = "Оплата товарів";
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
