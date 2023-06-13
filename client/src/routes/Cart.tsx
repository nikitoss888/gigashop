import { useLoaderData } from "react-router-dom";
import { ClearCartRequest, SetUpCartRequest, User } from "../http/User";
import { calculateDiscount, Item } from "../http/Items";
import { useState } from "react";
import { Box, Container, Divider, List, Typography } from "@mui/material";
import CartItem from "../components/Cart/CartItem";
import Button from "@mui/material/Button";
import { LiqPayPay } from "react-liqpay";
import Cookies from "js-cookie";
import ClientError from "../ClientError";
import { AxiosError } from "axios";
import SubmitButton from "../components/Common/SubmitButton";

export default function Cart() {
	document.title = "Кошик — gigashop";
	const { user, cart, error } = useLoaderData() as {
		user?: User;
		cart?: Item[];
		error?: ClientError;
	};

	if (error) throw error;
	if (!user) throw new ClientError(401, "Необхідно авторизуватися");

	const [cartState, setCartState] = useState(cart || []);
	const [data, setData] = useState<
		| {
				publicKey: string;
				privateKey: string;
				amount: string;
				currency: string;
				description: string;
				result_url: string;
				server_url: string;
				product_description: string;
				transactionId: string;
		  }
		| undefined
	>(undefined);

	const setUpCart = async () => {
		const token = Cookies.get("token");
		if (!token) throw new ClientError(401, "Необхідно авторизуватися");

		const result = await SetUpCartRequest(token).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) throw result;

		if (result.transactionId) {
			const publicKey = process.env.REACT_APP_LIQPAY_TEST_PUBLIC_KEY || "";
			const privateKey = process.env.REACT_APP_LIQPAY_TEST_PRIVATE_KEY || "";
			const result_url = (process.env.REACT_APP_NGROK_CLIENT_URL || "http://localhost:3000") + "/cart/success";
			const server_url =
				(process.env.REACT_APP_NGROK_SERVER_URL || "http://localhost:5000") +
				`/api/user/cart/success/${result.transactionId}`;

			setData({
				publicKey: publicKey,
				privateKey: privateKey,
				amount: total.toString(),
				currency: "UAH",
				description: "Оплата товарів",
				result_url,
				server_url,
				product_description: "Відеоігри та/або контент до них",
				transactionId: result.transactionId,
			});
			console.log({ transactionId: result.transactionId });
		} else {
			throw new ClientError(500, "Помилка при встановленні даних транзакції");
		}
	};

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

	return (
		<Container sx={{ marginTop: "15px", height: "100%" }}>
			<Typography variant='h3' textAlign='center' mt={3}>
				Кошик користувача {user.login}
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
						<SubmitButton onClick={setUpCart}>Підготувати кошик до оплати</SubmitButton>
						<Button onClick={onReset}>Очистити кошик</Button>
					</Box>
					{data && (
						<LiqPayPay
							publicKey={data.publicKey}
							privateKey={data.privateKey}
							amount={data.amount}
							description={data.description}
							currency={data.currency}
							orderId={data.transactionId}
							result_url={data.result_url}
							server_url={data.server_url}
							product_description={data.product_description}
							title='Оплатити'
						/>
					)}
				</>
			) : (
				<Typography variant='h5' textAlign='center' mt={3}>
					Кошик порожній
				</Typography>
			)}
		</Container>
	);
}
