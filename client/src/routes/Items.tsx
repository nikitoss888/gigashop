import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box } from "@mui/material";
import styled from "@emotion/styled";
import SearchBar from "../components/Form/SearchBar";
import FormGroup from "../components/Items/FormGroup";

const schema = yup.object().shape({
	name: yup.string().label("Назва"),
	priceFrom: yup.number().min(0).default(0).label("Ціна від"),
	priceTo: yup.number().min(0).default(0).label("Ціна до"),
	dateFrom: yup.date().label("Дата від"),
	dateTo: yup.date().label("Дата до"),
	genres: yup
		.array()
		.of(
			yup.object().shape({
				id: yup.number(),
				name: yup.string(),
			})
		)
		.label("Жанри"),
	publisher: yup
		.object()
		.shape({
			id: yup.number(),
			name: yup.string(),
		})
		.label("Видавництво"),
	developers: yup
		.array()
		.of(
			yup.object().shape({
				id: yup.number(),
				name: yup.string(),
			})
		)
		.label("Розробники"),
	discount: yup.boolean().label("Зі знижкою"),
	discountFrom: yup.number().when("discount", {
		is: true,
		then: yup.number().min(0).max(100).default(0).label("Зі знижкою від"),
		otherwise: yup.number().default(0),
	}),
	discountTo: yup.number().when("discount", {
		is: true,
		then: yup.number().min(0).max(100).default(0).label("Зі знижкою до"),
		otherwise: yup.number().default(0),
	}),
});

const Form = styled.form`
	display: grid;
	grid-template-columns: 1fr 3fr;
	grid-template-rows: 1fr auto;
	grid-template-areas:
		"search search"
		"sidesearch content";
	grid-column-gap: 20px;
	grid-row-gap: 20px;
`;

export default function Items() {
	const methods = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: any) => {
		try {
			console.log(data);
		} catch (err) {
			console.log(err);
		}
	};

	const onReset = () => {
		methods.reset();
	};

	return (
		<Box>
			<FormProvider {...methods}>
				<Form onSubmit={methods.handleSubmit(onSubmit)} onReset={onReset}>
					<SearchBar name={"name"} label={"Назва"} defValue={""} />
					<FormGroup />
					<input type='submit' />
					<input type='reset' />
					<button
						type='button'
						onClick={(e) => {
							e.preventDefault();
							console.log(methods.getValues());
						}}
					>
						GET VALUES
					</button>
				</Form>
			</FormProvider>
		</Box>
	);
}
