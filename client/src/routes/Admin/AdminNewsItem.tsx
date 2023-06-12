import { Link, useLoaderData, useNavigate } from "react-router-dom";
import ClientError from "../../ClientError";
import { Publication, Comment, DeletePublicationRequest } from "../../http/Publications";
import * as DOMPurify from "dompurify";
import { Alert, AlertColor, AlertTitle, Box, Dialog, IconButton, TextField, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Delete, Edit, Error, SettingsBackupRestore } from "@mui/icons-material";
import parse from "html-react-parser";
import NewsContent from "../../components/NewsItem/NewsContent";
import { useState } from "react";
import SubmitButton from "../../components/Common/SubmitButton";
import List from "../../components/Admin/PublicationsComments/List";
import { SortSwitch } from "./AdminNewsComments";
import { User } from "../../http/User";
import { useRecoilState } from "recoil";
import { userState } from "../../store/User";
import Cookies from "js-cookie";
import { SetPublicationViolationRequest } from "../../http/Moderation";
import { AxiosError } from "axios";

export default function AdminNewsItem() {
	const [user, _] = useRecoilState(userState);
	if (!user) throw new ClientError(403, "Доступ без авторизації заборонено");

	const navigate = useNavigate();

	const { publication, error } = useLoaderData() as {
		publication: Publication & { CommentsList: (Comment & { User: User })[]; AuthoredUser: User };
		error?: ClientError;
	};

	if (error) throw error;

	document.title =
		`${publication.AuthoredUser.firstName} ${publication.AuthoredUser.lastName} / ` +
		`${publication.title} — Адміністративна панель — gigashop`;

	const publicationData: Publication = publication;

	const Comments = publication.CommentsList.map((comment) => {
		return { ...comment, Publication: publicationData, User: comment.User } as Comment & {
			Publication: Publication;
			User: User;
		};
	});

	const cleanContent = DOMPurify.sanitize(publication.content, {
		USE_PROFILES: { html: true },
	});

	const [sortBy, setSortBy] = useState("createdAtAsc");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	const { descending } = SortSwitch(sortBy);
	const [comments, setComments] = useState(
		Comments.sort((a, b) => {
			if (descending) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}).slice((page - 1) * limit, page * limit) || []
	);
	const [maxPage, setMaxPage] = useState(Math.max(Math.ceil(publication.CommentsList.length / limit) || 1));

	let avgRate = comments.reduce((acc, comment) => acc + comment.rate, 0) / comments.length || 0;
	avgRate = Math.round(avgRate * 10) / 10;

	const getComments = (sortBy: string, limit: number, page: number) => {
		const { descending } = SortSwitch(sortBy);
		const comments =
			Comments.filter((comment) => comment.publicationId === publication.id)
				.sort((a, b) => {
					if (descending) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				})
				.slice((page - 1) * limit, page * limit) || [];
		setComments(comments);
		setMaxPage(Math.max(Math.ceil(publication.CommentsList.length / limit) || 1));
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

	const [alert, setAlert] = useState<{
		title: string;
		message: string;
		severity: AlertColor | undefined;
	}>({ title: "", message: "", severity: undefined });
	const [opedDialog, setOpedDialog] = useState(false);

	const token = Cookies.get("token");
	if (!token) throw new ClientError(403, "Ви не авторизовані");

	const [violation, setViolation] = useState(publication.violation || false);
	const [violationReason, setViolationReason] = useState<string>(publication.violation_reason || "");
	const [violationSet, setViolationSet] = useState(true);

	const toggleViolation = () => {
		setViolation(!violation);
		setViolationSet(false);
	};

	const sendViolation = async () => {
		const result = await SetPublicationViolationRequest(token, publication.id, {
			violation: violation,
			violation_reason: violationReason,
		}).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) {
			setAlert({
				title: "Помилка",
				message: result.message,
				severity: "error",
			});
			setOpedDialog(true);
			return;
		}

		setAlert({
			title: "Успіх",
			message: result.message,
			severity: "success",
		});
		setOpedDialog(true);
		setViolation(result.result.violation);
	};

	const onDelete = async () => {
		const result = await DeletePublicationRequest(token, publication.id).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) throw result;

		navigate("/admin/news");
	};

	return (
		<>
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
					{user.id === publication.AuthoredUser.id && (
						<Tooltip title={`Редагувати публікацію`}>
							<IconButton component={Link} to={`/news/${publication.id}/edit`}>
								<Edit sx={{ color: "primary.main" }} />
							</IconButton>
						</Tooltip>
					)}
					{["admin", "moderator"].includes(publication.AuthoredUser.role.toLowerCase()) && (
						<Tooltip title={`Видалити публікацію`}>
							<IconButton onClick={onDelete}>
								<Delete color='error' />
							</IconButton>
						</Tooltip>
					)}
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
					}}
				>
					{violation && (
						<>
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
						</>
					)}
					<SubmitButton onClick={sendViolation} disabled={violationSet}>
						Зберегти стан порушення
					</SubmitButton>
				</Box>
				<Typography variant='h6'>Заголовок: {publication.title}</Typography>
				<Typography variant='h6'>Створено: {new Date(publication.createdAt).toLocaleDateString()}</Typography>
				{publication.updatedAt && (
					<Typography variant='h6'>
						Оновлено: {new Date(publication.updatedAt).toLocaleDateString()}
					</Typography>
				)}
				<Typography variant='h6'>
					Автор: {publication.AuthoredUser.firstName} {publication.AuthoredUser.lastName}
				</Typography>
				{publication.tags && (
					<Typography variant='h6'>Теги: {publication.tags.map((tag) => tag).join(", ")}</Typography>
				)}
				<Typography variant='h6'>Рейтинг: {avgRate}</Typography>
				<Typography variant='h6'>Кількість коментарів: {comments.length}</Typography>
				<Typography variant='h6'>Приховано?: {publication.hide ? "Так" : "Ні"}</Typography>
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
			<Dialog open={opedDialog} onClose={() => setOpedDialog(false)}>
				<Alert severity={alert.severity}>
					<AlertTitle>{alert.title}</AlertTitle>
					{alert.message}
				</Alert>
			</Dialog>
		</>
	);
}
