import * as yup from "yup";
import { Box, Container } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "@mui/material/styles/styled";
import SearchBar from "../components/SearchPages/SearchBar";
import Filters from "../components/NewsList/Filters";
import Publications, { Publication } from "../mock/Publications";
import PublicationsList from "../components/NewsList/PublicationsList";
import Users from "../mock/Users";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import { Link, useLoaderData } from "react-router-dom";

const User = yup.object().shape({
	id: yup.number().required(),
	login: yup.string().required(),
	firstName: yup.string().required(),
	lastName: yup.string().required(),
});

const schema = yup.object().shape({
	title: yup.string().nullable().label("Заголовок"),
	createdFrom: yup
		.date()
		.nullable()
		.transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
		.label("Дата від"),
	createdTo: yup
		.date()
		.nullable()
		.transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
		.label("Дата до"),
	tags: yup.array().of(yup.string()).notRequired().label("Теги"),
	authors: yup.array().of(User).notRequired().label("Автори"),
});

const SortSwitch = (sortBy: string, a: Publication, b: Publication) => {
	switch (sortBy) {
		case "titleDesc":
			return b.title.localeCompare(a.title);
		case "titleAsc":
			return a.title.localeCompare(b.title);
		case "createdAtDesc":
			return b.createdAt.getTime() - a.createdAt.getTime();
		case "createdAtAsc":
		default:
			return a.createdAt.getTime() - b.createdAt.getTime();
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
	console.log({ data, totalCount });

	const [sortBy, setSortBy] = useState(initSortBy || "createdAtAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const methods = useForm({
		resolver: yupResolver(schema),
	});

	const [news, setNews] = useState(
		data.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit)
	);
	news.map((item) => {
		const user = Users.find((user) => user.id === item.userId);
		if (user) {
			item.user = user;
		}
	});
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 0) / limit) || 1);

	const getNews = (sortBy: string, limit: number, page: number) => {
		const news = Publications.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit);
		news.map((item) => {
			const user = Users.find((user) => user.id === item.userId);
			if (user) {
				item.user = user;
			}
		});
		setNews(news);
		setMaxPage(Math.ceil(totalCount / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getNews(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getNews(sortBy, limit, page);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getNews(sortBy, limit, localPage);
		setPage(localPage);
	};

	const onSubmit = (data: any) => {
		try {
			console.log(data);
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
