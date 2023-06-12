import { Box, Container } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { Company } from "../http/Companies";
import styled from "@mui/material/styles/styled";
import SearchBar from "../components/SearchPages/SearchBar";
import CompaniesGrid from "../components/Companies/CompaniesGrid";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { GetCompanies } from "./index";
import ClientError from "../ClientError";
import { AxiosError } from "axios";

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

	const { data, totalCount, initPage, initLimit, initSortBy, error } = useLoaderData() as {
		data?: Company[];
		totalCount?: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
		error?: ClientError;
	};
	if (error) throw error;

	const [sortBy, setSortBy] = useState(initSortBy || "nameAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const methods = useForm();

	const [companies, setCompanies] = useState(data || []);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getCompanies = async (sortBy: string, limit: number, page: number, name?: string) => {
		const result = await GetCompanies({ admin: false, sortBy, limit, page, name }).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) throw result;

		const { data, totalCount } = result;
		if (!data) throw new ClientError(500, "Помилка сервера");

		setCompanies(data);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = async (sortBy: string) => {
		const { name } = methods.getValues();
		await getCompanies(sortBy, limit, page, name);
		setSortBy(sortBy);
	};

	const limitUpdate = async (limit: number) => {
		const { name } = methods.getValues();
		await getCompanies(sortBy, limit, 1, name);
		setLimit(limit);
		setPage(1);
	};

	const pageUpdate = async (page: number) => {
		const { name } = methods.getValues();
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		await getCompanies(sortBy, limit, localPage, name);
		setPage(localPage);
	};

	const onSubmit = async () => {
		try {
			const { name } = methods.getValues();
			await getCompanies(sortBy, limit, page, name);
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
