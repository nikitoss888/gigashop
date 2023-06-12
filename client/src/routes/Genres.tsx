import { useForm, FormProvider } from "react-hook-form";
import { Box, Container } from "@mui/material";
import SearchBar from "../components/SearchPages/SearchBar";
import styled from "@mui/material/styles/styled";
import AlphabetGrid from "../components/Genres/AlphabetGrid";
import { Genre } from "../http/Genres";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { GetGenres } from "./index";
import ClientError from "../ClientError";
import { AxiosError } from "axios";
import { Item } from "../http/Items";

const BoxStyle = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: start;
	gap: 15px;
`;

export default function Genres() {
	const methods = useForm();

	const { data, error } = useLoaderData() as {
		data?: (Genre & {
			Items: Item[];
		})[];
		error?: ClientError;
	};

	if (error) throw error;

	const [genres, setGenres] = useState(data || []);
	document.title = `Жанри — gigashop`;

	const onSubmit = async (data: any) => {
		console.log(data);
		const result = await GetGenres({ admin: false, name: data.name }).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) throw result;

		const genres = result.data;
		setGenres(genres || []);
	};

	const onReset = () => {
		methods.reset();
	};

	return (
		<Container sx={{ marginTop: "15px", height: "100%" }}>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)} onReset={onReset}>
					<BoxStyle>
						<SearchBar name='name' label='Назва' defValue='' />
						<AlphabetGrid genres={genres} />
					</BoxStyle>
				</form>
			</FormProvider>
		</Container>
	);
}
