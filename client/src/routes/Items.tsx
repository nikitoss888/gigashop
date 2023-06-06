import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Container } from "@mui/material";
import styled from "@emotion/styled";
import SearchBar from "../components/SearchPages/SearchBar";
import Filters from "../components/Items/Filters";
import ItemsGrid from "../components/Items/ItemsGrid";
import { default as ItemsList } from "../mock/Items";
import { useEffect, useState } from "react";

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
	document.title = "Товари — gigashop";

	const [sortBy, setSortBy] = useState("releaseDate");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const methods = useForm({
		resolver: yupResolver(schema),
	});

	const [items, setItems] = useState(
		ItemsList.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.name.localeCompare(b.name);
				case "price":
					return a.price - b.price;
				case "releaseDate":
				default:
					return a.releaseDate.getTime() - b.releaseDate.getTime();
			}
		}).slice((page - 1) * limit, page * limit)
	);
	const [maxPage, setMaxPage] = useState(Math.ceil(ItemsList.length / limit) || 1);

	const getItems = (refresh?: boolean) => {
		const localPage = refresh ? 1 : page;
		const items = ItemsList.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.name.localeCompare(b.name);
				case "price":
					return a.price - b.price;
				default:
					return a.releaseDate.getTime() - b.releaseDate.getTime();
			}
		}).slice((localPage - 1) * limit, localPage * limit);
		setItems(items);
		refresh && setMaxPage(Math.ceil(ItemsList.length / limit) || 1);
	};

	useEffect(() => {
		setPage(1);
		getItems(true);
	}, [sortBy, limit]);

	useEffect(() => {
		getItems();
	}, [page]);

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
						<ItemsGrid
							items={items}
							sorting={{
								value: sortBy,
								setValue: setSortBy,
							}}
							limitation={{
								value: limit,
								setValue: setLimit,
							}}
							pagination={{
								value: page,
								setValue: setPage,
								maxValue: maxPage,
							}}
							sx={{
								gridRow: {
									sm: "3",
									md: "2",
								},
							}}
						/>
					</FormBox>
				</form>
			</FormProvider>
		</Container>
	);
}
