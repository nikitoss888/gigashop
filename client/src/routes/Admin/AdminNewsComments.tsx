import { useLoaderData } from "react-router-dom";
import PublicationsComments, { PublicationComment } from "../../mock/PublicationsComments";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/PublicationsComments/List";
import Users from "../../mock/Users";
import Publications from "../../mock/Publications";

const SortSwitch = (sortBy: string, a: PublicationComment, b: PublicationComment) => {
	switch (sortBy) {
		case "createdAtDesc":
			return b.createdAt.getTime() - a.createdAt.getTime();
		case "createdAtAsc":
		default:
			return a.createdAt.getTime() - b.createdAt.getTime();
	}
};

export default function AdminNewsComments() {
	document.title = "Коментарі до новин - Адміністративна панель - gigashop";

	const { data, totalCount } = useLoaderData() as {
		data: PublicationComment[];
		totalCount: number;
	};

	const [sortBy, setSortBy] = useState("createdAtAsc");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const [comments, setComments] = useState(
		data.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit)
	);
	comments.forEach((comment) => {
		comment.user = Users.find((user) => user.id === comment.userId);
		comment.publication = Publications.find((publication) => publication.id === comment.publicationId);
	});
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 0) / limit) || 1);

	const getComments = (sortBy: string, limit: number, page: number) => {
		const comments = PublicationsComments.sort((a, b) => SortSwitch(sortBy, a, b)).slice(
			(page - 1) * limit,
			page * limit
		);
		comments.forEach((comment) => {
			comment.user = Users.find((user) => user.id === comment.userId);
			comment.publication = Publications.find((publication) => publication.id === comment.publicationId);
		});
		setComments(comments);
		setMaxPage(Math.ceil(PublicationsComments.length / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getComments(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getComments(sortBy, limit, page);
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
				linkToUser
			/>
		</Box>
	);
}
export { SortSwitch };
