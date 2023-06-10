import * as yup from "yup";
import { Box, Container } from "@mui/material";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "@mui/material/styles/styled";
import SearchBar from "../components/SearchPages/SearchBar";
import Filters from "../components/NewsList/Filters";
import { Publication } from "../mock/Publications";
import PublicationsList from "../components/NewsList/PublicationsList";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import { Link, useLoaderData } from "react-router-dom";
import { GetPublications } from "./index";

const User = yup.object().shape({
	id: yup.number().required(),
	login: yup.string().required(),
	firstName: yup.string().required(),
	lastName: yup.string().required(),
});

const schema = yup.object().shape(
	{
		title: yup.string().nullable().label("Заголовок"),
		createdFrom: yup
			.date()
			.nullable()
			.transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
			.label("Дата від")
			.when(["createdTo"], {
				is: (createdTo: Date | string | null) => createdTo !== null,
				then: (schema) =>
					schema.max(yup.ref("createdTo"), "Початкова дата пошуку не може бути пізніше кінцевої"),
			}),
		createdTo: yup
			.date()
			.nullable()
			.transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
			.label("Дата до")
			.when(["createdFrom"], {
				is: (createdFrom: Date | string | null) => createdFrom !== null,
				then: (schema) =>
					schema.min(yup.ref("createdFrom"), "Кінцева дата пошуку не може бути раніше початкової"),
			}),
		tags: yup.array().of(yup.string()).notRequired().label("Теги"),
		authors: yup.array().of(User).notRequired().label("Автори"),
	},
	[["createdFrom", "createdTo"]]
);

const SortSwitch = (sortBy: string) => {
	switch (sortBy) {
		case "titleDesc":
			return { sortBy: "title", descending: true };
		case "titleAsc":
			return { sortBy: "title", descending: false };
		case "createdAtDesc":
			return { sortBy: "createdAt", descending: true };
		case "createdAtAsc":
		default:
			return { sortBy: "createdAt", descending: false };
	}
};

const FormBox = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: 15px;
`;

export default function NewsList() {
	document.title = "Новини - gigashop";

	const { data, totalCount, initPage, initLimit, initSortBy } = useLoaderData() as {
		data: Publication[];
		totalCount: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
	};

	const [sortBy, setSortBy] = useState(initSortBy || "createdAtAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const methods = useForm({
		resolver: yupResolver(schema),
	});

	const [news, setNews] = useState(data);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 0) / limit) || 1);

	type getNewsParams = {
		title?: string;
		dateFrom?: Date;
		dateTo?: Date;
		tags?: string[];
		authors?: {
			id: number;
			login: string;
			firstName: string;
			lastName: string;
		}[];
	};
	const [params, setParams] = useState<getNewsParams>({});

	const parseValues = (values: FieldValues): getNewsParams => {
		const params: getNewsParams = {};
		if (values.title) params.title = values.title;
		if (values.createdFrom) params.dateFrom = new Date(values.createdFrom);
		if (values.createdTo) params.dateTo = new Date(values.createdTo);
		if (values.tags) params.tags = values.tags;
		if (values.authors) params.authors = values.authors;
		console.log({ params });
		return params;
	};

	const getNews = (sortBy: string, limit: number, page: number, params?: getNewsParams) => {
		const { data, totalCount } = GetPublications({ admin: false, limit, page, sortBy, searchParams: params });
		setNews(data);
		setMaxPage(Math.ceil((totalCount || 0) / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getNews(sortBy, limit, page, params);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getNews(sortBy, limit, 1, params);
		setPage(1);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getNews(sortBy, limit, localPage, params);
		setPage(localPage);
	};

	const onSubmit = () => {
		try {
			const data = methods.getValues();
			const params = parseValues(data);
			setParams(params);
			getNews(sortBy, limit, page, params);
		} catch (error) {
			console.log(error);
		}
	};

	const onReset = () => {
		try {
			methods.reset();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container sx={{ mt: "15px", height: "100%" }}>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)} onReset={onReset}>
					<FormBox>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-around",
								alignItems: "center",
							}}
						>
							<Typography
								variant='h5'
								component={Link}
								to='/news/create'
								sx={{
									textDecoration: "none",
									color: "primary.main",
									"&:hover": {
										textDecoration: "underline",
									},
								}}
							>
								Створити новину
							</Typography>
						</Box>
						<SearchBar name='title' label='Заголовок' defValue='' />
						<Filters />
						<PublicationsList
							items={news}
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
						/>
					</FormBox>
				</form>
			</FormProvider>
		</Container>
	);
}
export { SortSwitch };
