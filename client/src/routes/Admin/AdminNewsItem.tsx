import { Link, useParams } from "react-router-dom";
import HTTPError from "../../HTTPError";
import Publications from "../../mock/Publications";
import Users from "../../mock/Users";
import * as DOMPurify from "dompurify";
import { Box, IconButton, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Delete, Edit } from "@mui/icons-material";
import PublicationsComments from "../../mock/PublicationsComments";
import parse from "html-react-parser";
import NewsContent from "../../components/NewsItem/NewsContent";

export default function AdminNewsItem() {
	const { id } = useParams();

	if (!id) throw new HTTPError(400, "Не вказано ID публікації");

	const parsed = parseInt(id);
	if (isNaN(parsed)) throw new HTTPError(400, "ID публікації не є числом");

	const publication = Publications.find((publication) => publication.id === parsed);
	if (!publication) throw new HTTPError(404, "Публікацію за даним ID не знайдено");

	const user = Users.find((user) => user.id === publication.userId);
	publication.user = user;

	const comments = PublicationsComments.filter((comment) => comment.publicationId === publication.id);
	let avgRate = comments.reduce((acc, comment) => acc + comment.rate, 0) / comments.length || 0;
	avgRate = Math.round(avgRate * 10) / 10;

	document.title =
		(publication.user && `${publication.user?.firstName} ${publication.user?.lastName} / `) +
		`${publication.title} — Адміністративна панель — gigashop`;

	const cleanContent = DOMPurify.sanitize(publication.content, {
		USE_PROFILES: { html: true },
	});

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "15px",
			}}
		>
			<Typography variant='h4' textAlign='center' mb={3}>
				Сторінка товару {publication.title}
			</Typography>
			<Box
				sx={{
					display: "flex",
					gap: "10px",
				}}
			>
				<Tooltip title={`Редагувати публікацію`}>
					<IconButton component={Link} to={`/admin/news/${publication.id}/edit`}>
						<Edit sx={{ color: "primary.main" }} />
					</IconButton>
				</Tooltip>
				<Tooltip title={`Видалити публікацію`}>
					<IconButton>
						<Delete color='error' />
					</IconButton>
				</Tooltip>
			</Box>
			<Typography variant='h6'>Заголовок: {publication.title}</Typography>
			<Typography variant='h6'>Створено: {publication.createdAt.toLocaleDateString()}</Typography>
			{publication.updatedAt && (
				<Typography variant='h6'>Оновлено: {publication.updatedAt.toLocaleDateString()}</Typography>
			)}
			{publication.user && (
				<Typography variant='h6'>
					Автор: {publication.user.firstName} {publication.user.lastName}
				</Typography>
			)}
			{publication.tags && (
				<Typography variant='h6'>Теги: {publication.tags.map((tag) => tag).join(", ")}</Typography>
			)}
			<Typography variant='h6'>Рейтинг: {avgRate}</Typography>
			<Typography variant='h6'>Кількість коментарів: {comments.length}</Typography>
			<Typography variant='h6'>
				Порушення?: {publication.violation ? publication.violation_reason || "Так" : "Ні"}
			</Typography>
			<NewsContent variant='body1' component='article'>
				{parse(cleanContent)}
			</NewsContent>
		</Box>
	);
}
