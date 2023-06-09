import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/Users/List";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Users, { User } from "../../mock/Users";

const SortSwitch = (sortBy: string, a: User, b: User) => {
	switch (sortBy) {
		default:
		case "createdAt":
			return a.createdAt > b.createdAt ? -1 : 1;
		case "createdAtDesc":
			return a.createdAt < b.createdAt ? -1 : 1;
		case "loginAsc":
			return a.login > b.login ? -1 : 1;
		case "loginDesc":
			return a.login < b.login ? -1 : 1;
	}
};

export default function AdminUsers() {
	document.title = `Користувачі — Адміністративна панель — gigashop`;

	const [sortBy, setSortBy] = useState("createdAt");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const { data, totalCount } = useLoaderData() as {
		data: User[];
		totalCount: number;
	};

	const [users, setUsers] = useState(
		data?.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit) || []
	);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 0) / limit) || 1);

	const getUsers = (sortBy: string, limit: number, page: number) => {
		const users = Users.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit);
		setUsers(users);
		setMaxPage(Math.ceil(Users.length / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getUsers(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getUsers(sortBy, limit, page);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getUsers(sortBy, limit, localPage);
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
