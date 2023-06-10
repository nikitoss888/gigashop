import { useLoaderData } from "react-router-dom";
import { Company } from "../../mock/Companies";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/Companies/List";
import { GetCompanies } from "../index";

export default function AdminCompanies() {
	document.title = `Компанії — Адміністративна панель — gigashop`;

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

	const [companies, setCompanies] = useState(data);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getCompanies = (sortBy: string, limit: number, page: number) => {
		const { data, totalCount } = GetCompanies({ admin: true, sortBy, limit, page });
		setCompanies(data);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getCompanies(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getCompanies(sortBy, limit, 1);
		setPage(1);
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
