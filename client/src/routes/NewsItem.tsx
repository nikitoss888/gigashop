import { useParams } from "react-router-dom";
import Publications from "../mock/Publications";
import HTTPError from "../HTTPError";
import { Container, Box } from "@mui/material";
import Author from "../components/NewsItem/Author";
import NewsContent from "../components/NewsItem/NewsContent";
import Users from "../mock/Users";
import PublicationsComments from "../mock/PublicationsComments";
import Typography from "@mui/material/Typography";
import * as DOMPurify from "dompurify";
import parse from "html-react-parser";
import ItemRating from "../components/Common/ItemRating";
import CommentsList from "../components/Common/CommentsList";
import { useLayoutEffect, useRef, useState } from "react";

export default function NewsItem() {
	const { id } = useParams();
	if (!id) throw new HTTPError(400, "Не вказано ID публікації");

	const parsed = parseInt(id);
	if (isNaN(parsed)) throw new HTTPError(400, "ID публікації не є числом");

	const publication = Publications.find((publication) => publication.id === parsed && !publication.hide);
	if (!publication) throw new HTTPError(404, "Публікацію за даним ID не знайдено");

	if (publication.violation)
		throw new HTTPError(
			403,
			`Публікація була заблокована за порушення правил${
				publication.violation ? `: ${publication.violation}` : ""
			}`
		);

	publication.user = Users.find((user) => user.id === publication.userId);
	const comments = PublicationsComments.filter((comment) => comment.publicationId === publication.id);
	comments.forEach((comment) => {
		comment.user = Users.find((user) => user.id === comment.userId);
	});

	const [contentHeight, setContentHeight] = useState<number>(0);
	const ref = useRef<any>(null);

	useLayoutEffect(() => {
		if (ref.current) {
			const height = ref.current.getBoundingClientRect().height;
			setContentHeight(height);
		}
	}, []);

	document.title =
		(publication.user && `${publication.user?.firstName} ${publication.user?.lastName} / `) +
		`${publication.title} — gigashop`;

	const cleanContent = DOMPurify.sanitize(publication.content, {
		USE_PROFILES: { html: true },
	});

	return (
		<Container sx={{ mt: "15px", height: "100%" }}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "15px",
				}}
			>
				{publication.user && <Author user={publication.user} />}
				<Box>
					<Typography variant='h3' textAlign='center'>
						{publication.title}
					</Typography>
					<Typography variant='subtitle1' textAlign='center'>
						{publication.createdAt.toLocaleDateString()}
					</Typography>
				</Box>
				{publication.tags && (
					<Typography variant='h6'>Теги: {publication.tags.map((tag) => tag).join(", ")}</Typography>
				)}
				<NewsContent variant='body1' component='article' ref={ref}>
					{parse(cleanContent)}
				</NewsContent>
				{publication.tags && contentHeight > 600 && (
					<Typography variant='h6'>Теги: {publication.tags.map((tag) => tag).join(", ")}</Typography>
				)}
				<ItemRating comments={comments} />
				{comments.length > 0 && <CommentsList comments={comments} />}
			</Box>
		</Container>
	);
}
