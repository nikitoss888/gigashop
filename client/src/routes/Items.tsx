import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Container } from "@mui/material";
import styled from "@emotion/styled";
import SearchBar from "../components/SearchPages/SearchBar";
import Filters from "../components/Items/Filters";
import ItemsGrid from "../components/Items/ItemsGrid";
import { Item } from "../http/Items";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { GetItems } from "./index";
import ClientError from "../ClientError";
import { Company } from "../http/Companies";
import { Genre } from "../http/Genres";

const Object = yup.object().shape({
	id: yup.number(),
	name: yup.string(),
});

const schema = yup.object().shape(
	{
		name: yup.string().nullable().label("Назва"),
		priceFrom: yup
			.number()
			.nullable()
			.transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
			.min(0)
			.label("Ціна від")
			.when(["priceTo"], {
				is: (priceTo: number | null) => priceTo !== null,
				then: (schema) => schema.max(yup.ref("priceTo"), "Початкова ціна пошуку не може бути більше кінцевої"),
			}),
		priceTo: yup
			.number()
			.nullable()
			.transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
			.label("Ціна до")
			.when(["priceFrom"], {
				is: (priceFrom: number | null) => priceFrom !== null,
				then: (schema) => schema.min(yup.ref("priceFrom"), "Кінцева ціна пошуку не може бути менше початкової"),
			}),
		dateFrom: yup
			.date()
			.nullable()
			.transform((value: string, originalValue: string) => (originalValue.trim() === "" ? null : value))
			.label("Дата від")
			.when(["dateTo"], {
				is: (dateTo: Date | string | null) => dateTo !== null,
				then: (schema) => schema.max(yup.ref("dateTo"), "Початкова дата пошуку не може бути пізніше кінцевої"),
			}),
		dateTo: yup
			.date()
			.nullable()
			.transform((value: string, originalValue: string) => (originalValue.trim() === "" ? null : value))
			.label("Дата до")
			.when(["dateFrom"], {
				is: (dateFrom: Date | string | null) => dateFrom !== null,
				then: (schema) => schema.min(yup.ref("dateFrom"), "Кінцева дата пошуку не може бути раніше початкової"),
			}),
		genres: yup.array().of(Object).notRequired().label("Жанри"),
		publisher: Object.notRequired().label("Видавництво"),
		developers: yup.array().of(Object).notRequired().label("Розробники"),
		discount: yup.boolean().notRequired().label("Зі знижкою"),
	},
	[
		["priceFrom", "priceTo"],
		["dateFrom", "dateTo"],
	]
);

const SortSwitch = (sortBy: string) => {
	switch (sortBy) {
		case "nameDesc":
			return { sortBy: "name", descending: true };
		case "nameAsc":
			return { sortBy: "name", descending: false };
		case "priceDesc":
			return { sortBy: "price", descending: true };
		case "priceAsc":
			return { sortBy: "price", descending: false };
		case "releaseDateDesc":
			return { sortBy: "releaseDate", descending: true };
		case "releaseDateAsc":
		default:
			return { sortBy: "releaseDate", descending: false };
	}
};

const FormBox = styled(Box)`
	display: grid;
	grid-template-rows: repeat(auto-fill, auto);
	gap: 15px;
`;

export default function Items() {
	document.title = "Товари — gigashop";
	const { data, totalCount, initPage, initSortBy, initLimit, error, companies, genres } = useLoaderData() as {
		data?: Item[];
		totalCount?: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
		error?: ClientError;
		companies: Company[];
		genres: Genre[];
	};
	if (error) throw error;

	const [sortBy, setSortBy] = useState(initSortBy || "releaseDateAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const methods = useForm({
		resolver: yupResolver(schema),
	});

	const [items, setItems] = useState(data || []);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	type getItemsParams = {
		name?: string;
		priceFrom?: number;
		priceTo?: number;
		dateFrom?: Date;
		dateTo?: Date;
		genres?: {
			id: number;
			name: string;
		}[];
		developers?: {
			id: number;
			name: string;
		}[];
		publisher?: {
			id: number;
			name: string;
		};
		discount?: boolean;
	};
	const [params, setParams] = useState<getItemsParams>({});

	const parseValues = (values: FieldValues): getItemsParams => {
		const params: getItemsParams = {};
		if (values.name) params.name = values.name;
		if (values.priceFrom) params.priceFrom = values.priceFrom;
		if (values.priceTo) params.priceTo = values.priceTo;
		if (values.dateFrom) params.dateFrom = new Date(values.dateFrom);
		if (values.dateTo) params.dateTo = new Date(values.dateTo);
		if (values.genres) params.genres = values.genres;
		if (values.developers) params.developers = values.developers;
		if (values.publisher) params.publisher = values.publisher;
		if (values.discount) params.discount = values.discount;
		console.log({ params });
		return params;
	};

	const getItems = async (sortBy: string, limit: number, page: number, params?: getItemsParams) => {
		const { data, totalCount, error } = await GetItems({ admin: false, sortBy, limit, page, searchParams: params });
		if (error) throw error;

		setItems(data);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = async (sortBy: string) => {
		await getItems(sortBy, limit, page, params);
		setSortBy(sortBy);
	};

	const limitUpdate = async (limit: number) => {
		await getItems(sortBy, limit, 1, params);
		setLimit(limit);
		setPage(1);
	};

	const pageUpdate = async (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		await getItems(sortBy, limit, localPage, params);
		setPage(localPage);
	};

	const onSubmit = async () => {
		try {
			const data = methods.getValues();
			const params = parseValues(data);
			setParams(params);
			await getItems(sortBy, limit, page, params);
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
						<Filters companies={companies} genres={genres} />
						<ItemsGrid
							items={items}
							sorting={{
								value: sortBy,
								setValue: sortByUpdate,
							}}
							limitation={{
								value: limit,
								setValue: limitUpdate,
							}}
							pagination={{
								value: page,
								setValue: pageUpdate,
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
export { SortSwitch };
