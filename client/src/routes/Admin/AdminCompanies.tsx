import { useLoaderData } from "react-router-dom";
import { Company, DeleteCompanyRequest } from "../../http/Companies";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/Companies/List";
import { GetCompanies } from "../index";
import ClientError from "../../ClientError";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export default function AdminCompanies() {
	document.title = `Компанії — Адміністративна панель — gigashop`;

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

	const [companies, setCompanies] = useState(data || []);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getCompanies = async (sortBy: string, limit: number, page: number) => {
		const result = await GetCompanies({ admin: true, sortBy, limit, page }).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) throw result;

		const { data, totalCount } = result;

		setCompanies(data || []);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = async (sortBy: string) => {
		await getCompanies(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = async (limit: number) => {
		await getCompanies(sortBy, limit, 1);
		setPage(1);
		setLimit(limit);
	};

	const pageUpdate = async (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		await getCompanies(sortBy, limit, localPage);
		setPage(localPage);
	};

	const onDelete = async (id: number) => {
		const token = Cookies.get("token");
		if (!token) throw new ClientError(403, "Необхідно авторизуватися");

		const result = await DeleteCompanyRequest(token, id).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) throw result;

		if (result) await getCompanies(sortBy, limit, page);
	};

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список компаній
			</Typography>
			<List
				companies={companies}
				onDelete={onDelete}
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
