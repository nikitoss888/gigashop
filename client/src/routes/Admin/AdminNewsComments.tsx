import { useLoaderData } from "react-router-dom";
import { Comment, Publication } from "../../http/Publications";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/PublicationsComments/List";
import { GetPublicationsComments } from "../index";
import ClientError from "../../ClientError";
import { User } from "../../http/User";

const SortSwitch = (sortBy: string) => {
	switch (sortBy) {
		case "createdAtDesc":
			return { descending: true };
		case "createdAtAsc":
		default:
			return { descending: false };
	}
};

export default function AdminNewsComments() {
	document.title = "Коментарі до новин - Адміністративна панель - gigashop";

	const { data, totalCount, initPage, initSortBy, initLimit, error } = useLoaderData() as {
		data?: (Comment & { User: User; Publication: Publication })[];
		totalCount?: number;
		initLimit?: number;
		initPage?: number;
		initSortBy?: string;
		error?: ClientError;
	};

	if (error) throw error;

	const [sortBy, setSortBy] = useState(initSortBy || "createdAtAsc");
	const [limit, setLimit] = useState(initLimit || 12);
	const [page, setPage] = useState(initPage || 1);

	const [comments, setComments] = useState(data || []);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 1) / limit) || 1);

	const getComments = async (sortBy: string, limit: number, page: number) => {
		const { data, totalCount, error } = await GetPublicationsComments({ limit, page, sortBy });
		if (error) throw error;

		setComments(data || []);
		setMaxPage(Math.ceil((totalCount || 1) / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getComments(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getComments(sortBy, limit, 1);
		setPage(1);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getComments(sortBy, limit, localPage);
		setPage(localPage);
	};

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Список коментарів
			</Typography>
			<List
				comments={comments}
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
				linkToPublication
			/>
		</Box>
	);
}
export { SortSwitch };
