import { useParams } from "react-router-dom";
import Publications from "../mock/Publications";
import HTTPError from "../HTTPError";
import { Container } from "@mui/material";
import Grid from "../components/Company/Grid";
import Author from "../components/NewsItem/Author";
import Users from "../mock/Users";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import * as DOMPurify from "dompurify";
import parse from "html-react-parser";

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
	const cleanContent = DOMPurify.sanitize(publication.content, {
		USE_PROFILES: { html: true },
	});

	return (
		<Container sx={{ mt: "15px", height: "100%" }}>
			<Grid>
				{publication.user && <Author user={publication.user} />}
				<Typography variant='h3' textAlign='center'>
					{publication.title}
				</Typography>
				<Content variant='body1' mt={3}>
					{parse(cleanContent)}
				</Content>
			</Grid>
		</Container>
	);
}
