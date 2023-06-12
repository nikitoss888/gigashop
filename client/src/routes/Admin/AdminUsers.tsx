import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/Users/List";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { GetUsers } from "../index";
import { User } from "../../http/User";
import ClientError from "../../ClientError";

const SortSwitch = (sortBy: string) => {
	switch (sortBy) {
		default:
		case "createdAtAsc":
			return { sortBy: "createdAt", descending: false };
		case "createdAtDesc":
			return { sortBy: "createdAt", descending: true };
		case "loginAsc":
			return { sortBy: "login", descending: false };
		case "loginDesc":
			return { sortBy: "login", descending: true };
	}
};

export default function AdminUsers() {
	document.title = `Користувачі — Адміністративна панель — gigashop`;

	const { data, totalCount, initPage, initLimit, initSortBy, error } = useLoaderData() as {
		data?: User[];
		totalCount?: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
		error?: ClientError;
	};
	if (error) throw error;

	const [sortBy, setSortBy] = useState(initSortBy || "createdAt");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const [users, setUsers] = useState(data || []);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getUsers = async (sortBy: string, limit: number, page: number) => {
		const { data, totalCount, error } = await GetUsers({ sortBy, limit, page });
		if (error) throw error;

		setUsers(data || []);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = async (sortBy: string) => {
		await getUsers(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = async (limit: number) => {
		await getUsers(sortBy, limit, 1);
		setPage(1);
		setLimit(limit);
	};

	const pageUpdate = async (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		await getUsers(sortBy, limit, localPage);
		setPage(localPage);
	};

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список користувачів
			</Typography>
			<List
				users={users}
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
export { SortSwitch };
