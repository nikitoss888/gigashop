declare module "react-liqpay" {
	import { DetailedReactHTMLElement, InputHTMLAttributes } from "react";

	type LiqPayPayProps = {
		publicKey: string;
		privateKey: string;
		currency: string;
		amount: string;
		description: string;
		orderId: string;
		title?: string;
		style?: {};
		result_url?: string;
		server_url?: string;
		disabled?: boolean;
		extra?: {};
		product_description?: string;
	};
	export function LiqPayPay(
		props: LiqPayPayProps
	): DetailedReactHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
}
