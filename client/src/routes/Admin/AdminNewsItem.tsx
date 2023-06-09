import { Link, useLoaderData } from "react-router-dom";
import ClientError from "../../ClientError";
import { Publication } from "../../mock/Publications";
import Users from "../../mock/Users";
import * as DOMPurify from "dompurify";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Delete, Edit, Visibility, VisibilityOff, Error, SettingsBackupRestore } from "@mui/icons-material";
import PublicationsComments from "../../mock/PublicationsComments";
import parse from "html-react-parser";
import NewsContent from "../../components/NewsItem/NewsContent";
import { useState } from "react";
import SubmitButton from "../../components/Common/SubmitButton";
import List from "../../components/Admin/PublicationsComments/List";
import { SortSwitch } from "./AdminNewsComments";

export default function AdminNewsItem() {
	const { publication, error } = useLoaderData() as {
		publication: Publication;
		error?: ClientError;
	};

	if (error) throw error;

	const [hide, setHide] = useState(publication.hide || false);
	const [violation, setViolation] = useState(publication.violation || false);
	const [violationReason, setViolationReason] = useState<string>(publication.violation_reason || "");
	const [violationSet, setViolationSet] = useState(true);
	const toggleHide = () =>
		setHide((prev) => {
			console.log({ violation: !violation, prev });
			if (violation) return true;
			return !prev;
		});

	const toggleViolation = () => {
		console.log({ violation: !violation });
		setViolation(!violation);
		if (!violation) setHide(true);
		else setHide(false);
	};

	const sendViolation = () => {
		setViolationSet(true);
		console.log({
			violation,
			violation_reason: violation ? violationReason : null,
		});
	};

	document.title =
		(publication.user && `${publication.user?.firstName} ${publication.user?.lastName} / `) +
		`${publication.title} — Адміністративна панель — gigashop`;

	const cleanContent = DOMPurify.sanitize(publication.content, {
		USE_PROFILES: { html: true },
	});

	const [sortBy, setSortBy] = useState("createdAtAsc");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const [comments, setComments] = useState(
		publication.comments?.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit) || []
	);
	comments.forEach((comment) => {
		comment.user = Users.find((user) => user.id === comment.userId);
		comment.publication = publication;
	});
	const [maxPage, setMaxPage] = useState(Math.ceil((publication.comments?.length || 0) / limit) || 1);

	let avgRate = comments.reduce((acc, comment) => acc + comment.rate, 0) / comments.length || 0;
	avgRate = Math.round(avgRate * 10) / 10;

	const getComments = (sortBy: string, limit: number, page: number) => {
		const comments = PublicationsComments.filter((comment) => comment.publicationId === publication.id)
			.sort((a, b) => SortSwitch(sortBy, a, b))
			.slice((page - 1) * limit, page * limit);
		comments.forEach((comment) => {
			comment.user = Users.find((user) => user.id === comment.userId);
			comment.publication = publication;
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
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "15px",
			}}
		>
			<Typography variant='h4' textAlign='center' mb={3}>
				Сторінка публікації {publication.title}
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
				{hide ? (
					<Tooltip title={`Відновити публікацію`}>
						<IconButton onClick={toggleHide}>
							<Visibility sx={{ color: "primary.main" }} />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip title={`Приховати публікацію`}>
						<IconButton onClick={toggleHide}>
							<VisibilityOff sx={{ color: "primary.main" }} />
						</IconButton>
					</Tooltip>
				)}
				{violation ? (
					<Tooltip title={`Зняти порушення`}>
						<IconButton onClick={toggleViolation}>
							<SettingsBackupRestore sx={{ color: "primary.main" }} />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip title={`Встановити порушення`}>
						<IconButton onClick={toggleViolation}>
							<Error sx={{ color: "accent.main" }} />
						</IconButton>
					</Tooltip>
				)}
				<Tooltip title={`Видалити публікацію`}>
					<IconButton>
						<Delete color='error' />
					</IconButton>
				</Tooltip>
			</Box>
			{violation && (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Typography variant='h6' color='accent.main'>
						Зміст порушення:
					</Typography>
					<TextField
						name='violation_reason'
						id='violation_reason'
						value={violationReason}
						onChange={(e) => {
							setViolationReason(e.target.value);
							setViolationSet(false);
						}}
						sx={{
							mb: 1,
						}}
					/>
					<SubmitButton onClick={sendViolation} disabled={violationSet}>
						Зберегти
					</SubmitButton>
				</Box>
			)}
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
			<Typography variant='h6'>Приховано?: {hide ? "Так" : "Ні"}</Typography>
			<Box>
				<Typography variant='h6'>Зміст:</Typography>
				<NewsContent variant='body1' component='article'>
					{parse(cleanContent)}
				</NewsContent>
			</Box>
			<Box>
				<Typography variant='h6' mb={2}>
					Коментарі:
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
					linkToUser
				/>
			</Box>
		</Box>
	);
}
