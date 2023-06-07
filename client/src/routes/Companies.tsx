import { Box, Container } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { default as CompaniesList, Company } from "../mock/Companies";
import styled from "@mui/material/styles/styled";
import SearchBar from "../components/SearchPages/SearchBar";
import CompaniesGrid from "../components/Companies/CompaniesGrid";
import { useEffect, useState } from "react";

const BoxStyle = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: start;
	gap: 15px;
`;

const SortSwitch = (sortBy: string, a: Company, b: Company) => {
	switch (sortBy) {
		case "foundedDesc":
			return b.founded.getTime() - a.founded.getTime();
		case "foundedAsc":
			return a.founded.getTime() - b.founded.getTime();
		case "nameDesc":
			return b.name.localeCompare(a.name);
		case "nameAsc":
		default:
			return a.name.localeCompare(b.name);
	}
};

export default function Companies() {
	document.title = `Компанії — gigashop`;

	const [sortBy, setSortBy] = useState("nameAsc");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const methods = useForm();

	const [companies, setCompanies] = useState(
		CompaniesList.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit)
	);
	const [maxPage, setMaxPage] = useState(Math.ceil(CompaniesList.length / limit) || 1);

	const getCompanies = (refresh?: boolean) => {
		const localPage = refresh ? 1 : page;
		const companies = CompaniesList.sort((a, b) => SortSwitch(sortBy, a, b)).slice(
			(localPage - 1) * limit,
			localPage * limit
		);
		setCompanies(companies);
		refresh && setMaxPage(Math.ceil(CompaniesList.length / limit) || 1);
	};

	useEffect(() => {
		setPage(1);
		getCompanies(true);
	}, [sortBy, limit]);

	useEffect(() => {
		getCompanies();
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
		<Container sx={{ marginTop: "15px", height: "100%" }}>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)} onReset={onReset}>
					<BoxStyle>
						<SearchBar name='name' label='Назва' defValue='' />
						<CompaniesGrid
							companies={companies}
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
					</BoxStyle>
				</form>
			</FormProvider>
		</Container>
	);
}
