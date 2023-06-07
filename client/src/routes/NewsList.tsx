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
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

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

	const [sortBy, setSortBy] = useState("createdAtAsc");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const methods = useForm({
		resolver: yupResolver(schema),
	});

	const [news, setNews] = useState(
		Publications.sort((a, b) => SortSwitch(sortBy, a, b))
			.slice((page - 1) * limit, page * limit)
			.filter((item) => !item.hide && !item.violation)
	);
	news.map((item) => {
		const user = Users.find((user) => user.id === item.userId);
		if (user) {
			item.user = user;
		}
	});
	const [maxPage, setMaxPage] = useState(Math.ceil(Publications.length / limit) || 1);

	const getNews = (refresh?: boolean) => {
		const localPage = refresh ? 1 : page;
		const news = Publications.sort((a, b) => SortSwitch(sortBy, a, b))
			.slice((localPage - 1) * limit, localPage * limit)
			.filter((item) => !item.hide);
		news.map((item) => {
			const user = Users.find((user) => user.id === item.userId);
			if (user) {
				item.user = user;
			}
		});
		setNews(news);
		refresh && setMaxPage(Math.ceil(Publications.length / limit) || 1);
	};

	useEffect(() => {
		setPage(1);
		getNews(true);
	}, [sortBy, limit]);

	useEffect(() => {
		getNews();
	}, [page]);

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
						/>
					</FormBox>
				</form>
			</FormProvider>
		</Container>
	);
}
