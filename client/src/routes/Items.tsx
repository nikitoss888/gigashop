import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Container } from "@mui/material";
import styled from "@emotion/styled";
import SearchBar from "../components/SearchPages/SearchBar";
import Filters from "../components/Items/Filters";
import ItemsGrid from "../components/Items/ItemsGrid";
import { default as ItemsList } from "../mock/Items";

const Object = yup.object().shape({
	id: yup.number(),
	name: yup.string(),
});

const schema = yup.object().shape({
	name: yup.string().nullable().label("Назва"),
	priceFrom: yup
		.number()
		.nullable()
		.transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
		.min(0)
		.max(yup.ref("priceTo"), "Початкова ціна пошуку не може бути більше кінцевої")
		.label("Ціна від"),
	priceTo: yup
		.number()
		.nullable()
		.transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
		.min(yup.ref("priceFrom"), "Кінцева ціна пошуку не може бути менше початкової")
		.label("Ціна до"),
	dateFrom: yup
		.date()
		.nullable()
		.transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
		.max(yup.ref("dateTo"), "Початкова дата пошуку не може бути пізніше кінцевої")
		.label("Дата від"),
	dateTo: yup
		.date()
		.nullable()
		.transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
		.min(yup.ref("dateFrom"), "Кінцева дата пошуку не може бути раніше початкової")
		.label("Дата до"),
	genres: yup.array().of(Object).notRequired().label("Жанри"),
	publisher: Object.notRequired().label("Видавництво"),
	developers: yup.array().of(Object).notRequired().label("Розробники"),
	discount: yup.boolean().notRequired().label("Зі знижкою"),
});

const FormBox = styled(Box)`
	display: grid;
	grid-template-rows: repeat(auto-fill, auto);
	gap: 15px;
`;

export default function Items() {
	const methods = useForm({
		resolver: yupResolver(schema),
	});

	const items = ItemsList;
	document.title = "Товари — gigashop";

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
		<Container sx={{ marginTop: "15px" }}>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)} onReset={onReset}>
					<FormBox
						sx={{
							gridTemplateColumns: { sm: "1fr", md: "1fr 3fr" },
						}}
					>
						<SearchBar name='name' label='Назва' defValue='' />
						<Filters />
						<ItemsGrid items={items} sx={{ gridRow: { sm: "3", md: "2" } }} />
					</FormBox>
				</form>
			</FormProvider>
		</Container>
	);
}
