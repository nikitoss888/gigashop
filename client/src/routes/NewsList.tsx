import * as yup from "yup";
import { Box, Container } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "@mui/material/styles/styled";
import SearchBar from "../components/SearchPages/SearchBar";
import Filters from "../components/NewsList/Filters";
import Publications from "../mock/Publications";
import PublicationsList from "../components/NewsList/PublicationsList";
import Users from "../mock/Users";

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

const FormBox = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: 15px;
`;

export default function NewsList() {
	const methods = useForm({
		resolver: yupResolver(schema),
	});

	const news = Publications;
	news.map((item) => {
		const user = Users.find((user) => user.id === item.userId);
		if (user) {
			item.user = user;
		}
	});
	document.title = "Новини - gigashop";

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
						<SearchBar name='title' label='Заголовок' defValue='' />
						<Filters />
						<PublicationsList items={news} />
					</FormBox>
				</form>
			</FormProvider>
		</Container>
	);
}
