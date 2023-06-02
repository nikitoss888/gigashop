import { Box, Container } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { default as CompaniesList } from "../mock/Companies";
import styled from "@mui/material/styles/styled";
import SearchBar from "../components/SearchPages/SearchBar";
import CompaniesGrid from "../components/Companies/CompaniesGrid";

const BoxStyle = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: start;
	gap: 15px;
`;

export default function Companies() {
	const methods = useForm();

	const companies = CompaniesList.sort((a, b) => a.name.localeCompare(b.name));
	document.title = `Компанії — gigashop`;

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
						<CompaniesGrid companies={companies} />
					</BoxStyle>
				</form>
			</FormProvider>
		</Container>
	);
}
