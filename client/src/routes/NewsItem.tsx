import { useParams } from "react-router-dom";
import Publications from "../mock/Publications";
import HTTPError from "../HTTPError";
import { Container, Box } from "@mui/material";
import Author from "../components/NewsItem/Author";
import Users from "../mock/Users";
import PublicationsComments from "../mock/PublicationsComments";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import * as DOMPurify from "dompurify";
import parse from "html-react-parser";
import ItemRating from "../components/Common/ItemRating";
import CommentsList from "../components/Common/CommentsList";

const Content = styled(Typography)`
	white-space: pre-wrap;
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		color: inherit;
		font: inherit;
	}
	p {
		color: inherit;
		font: inherit;
	}
` as typeof Typography;

export default function NewsItem() {
	const { id } = useParams();
	if (!id) throw new HTTPError(400, "Не вказано ID публікації");

	const parsed = parseInt(id);
	if (isNaN(parsed)) throw new HTTPError(400, "ID публікації не є числом");

	const publication = Publications.find((publication) => publication.id === parsed);
	if (!publication) throw new HTTPError(404, "Публікацію за даним ID не знайдено");

	publication.user = Users.find((user) => user.id === publication.userId);
	const comments = PublicationsComments.filter((comment) => comment.publicationId === publication.id);
	comments.forEach((comment) => {
		comment.user = Users.find((user) => user.id === comment.userId);
	});

	document.title = `${publication.user?.firstName} ${publication.user?.lastName} / ${publication.title} — gigashop`;

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
				<Typography variant='h3' textAlign='center'>
					{publication.title}
				</Typography>
				<Content variant='body1'>{parse(cleanContent)}</Content>
				<ItemRating comments={comments} />
				{comments.length > 0 && <CommentsList comments={comments} />}
			</Box>
		</Container>
	);
}
