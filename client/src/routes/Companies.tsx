import { Box, Container } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { default as CompaniesList, Company } from "../mock/Companies";
import styled from "@mui/material/styles/styled";
import SearchBar from "../components/SearchPages/SearchBar";
import CompaniesGrid from "../components/Companies/CompaniesGrid";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

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

	const { data, totalCount, initPage, initLimit, initSortBy } = useLoaderData() as {
		data: Company[];
		totalCount: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
	};

	const [sortBy, setSortBy] = useState(initSortBy || "nameAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const methods = useForm();

	const [companies, setCompanies] = useState(
		data.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit)
	);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 0) / limit) || 1);

	const getCompanies = (sortBy: string, limit: number, page: number) => {
		const companies = CompaniesList.sort((a, b) => SortSwitch(sortBy, a, b)).slice(
			(page - 1) * limit,
			page * limit
		);
		setCompanies(companies);
		setMaxPage(Math.ceil(CompaniesList.length / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getCompanies(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getCompanies(sortBy, limit, page);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getCompanies(sortBy, limit, localPage);
		setPage(localPage);
	};

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
					</BoxStyle>
				</form>
			</FormProvider>
		</Container>
	);
}
export { SortSwitch };
