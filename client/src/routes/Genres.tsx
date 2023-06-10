import { useForm, FormProvider } from "react-hook-form";
import { Box, Container } from "@mui/material";
import SearchBar from "../components/SearchPages/SearchBar";
import styled from "@mui/material/styles/styled";
import AlphabetGrid from "../components/Genres/AlphabetGrid";
import { Genre } from "../mock/Genres";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { GetGenres } from "./index";

const BoxStyle = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: start;
	gap: 15px;
`;

export default function Genres() {
	const methods = useForm();

	const { data } = useLoaderData() as {
		data: Genre[];
	};

	const [genres, setGenres] = useState(data);
	document.title = `Жанри — gigashop`;

	const onSubmit = (data: any) => {
		try {
			console.log(data);
			const { data: genres } = GetGenres({ admin: false, name: data.name });
			setGenres(genres);
		} catch (err) {
			console.log(err);
		}
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
