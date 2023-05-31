import { useForm, FormProvider } from "react-hook-form";
import { Box, Container } from "@mui/material";
import SearchBar from "../components/SearchPages/SearchBar";
import styled from "@mui/material/styles/styled";
import AlphabetGrid from "../components/Genres/AlphabetGrid";
import { default as GenresList } from "../mock/Genres";

const BoxStyle = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: start;
	gap: 15px;
`;

export default function Genres() {
	document.title = `gigashop — Жанри`;
	const methods = useForm();

	const genres = GenresList.sort((a, b) => a.name.localeCompare(b.name));

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
