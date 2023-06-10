import { Box, Container } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { Company } from "../mock/Companies";
import styled from "@mui/material/styles/styled";
import SearchBar from "../components/SearchPages/SearchBar";
import CompaniesGrid from "../components/Companies/CompaniesGrid";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { GetCompanies } from "./index";

const BoxStyle = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: start;
	gap: 15px;
`;

const SortSwitch = (sortBy: string) => {
	switch (sortBy) {
		case "foundedDesc":
			return { sortBy: "founded", descending: true };
		case "foundedAsc":
			return { sortBy: "founded", descending: false };
		case "nameDesc":
			return { sortBy: "name", descending: true };
		case "nameAsc":
		default:
			return { sortBy: "name", descending: false };
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

	const [companies, setCompanies] = useState(data);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 0) / limit) || 1);

	const getCompanies = (sortBy: string, limit: number, page: number, name?: string) => {
		const { data, totalCount } = GetCompanies({ admin: false, sortBy, limit, page, name });
		setCompanies(data);
		setMaxPage(Math.ceil((totalCount || 0) / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		const { name } = methods.getValues();
		getCompanies(sortBy, limit, page, name);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		const { name } = methods.getValues();
		getCompanies(sortBy, limit, 1, name);
		setLimit(limit);
		setPage(1);
	};

	const pageUpdate = (page: number) => {
		const { name } = methods.getValues();
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getCompanies(sortBy, limit, localPage, name);
		setPage(localPage);
	};

	const onSubmit = () => {
		try {
			const { name } = methods.getValues();
			getCompanies(sortBy, limit, page, name);
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
