import { useLoaderData } from "react-router-dom";
import Companies, { Company } from "../../mock/Companies";
import { useState } from "react";
import { SortSwitch } from "../Companies";
import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/Companies/List";

export default function AdminCompanies() {
	document.title = `Компанії — Адміністративна панель — gigashop`;

	const { data, totalCount } = useLoaderData() as {
		data: Company[];
		totalCount: number;
	};

	const [sortBy, setSortBy] = useState("nameAsc");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const [companies, setCompanies] = useState(
		data.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit)
	);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 0) / limit) || 1);

	const getCompanies = (sortBy: string, limit: number, page: number) => {
		const companies = Companies.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit);
		setCompanies(companies);
		setMaxPage(Math.ceil(Companies.length / limit) || 1);
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

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список компаній
			</Typography>
			<List
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
		</Box>
	);
}
