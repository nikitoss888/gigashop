import { useLoaderData } from "react-router-dom";
import { Publication, Comment, SetCommentRequest, DeleteCommentRequest } from "../http/Publications";
import ClientError from "../ClientError";
import { Container, Box, Dialog, Alert, AlertTitle, AlertColor } from "@mui/material";
import Author from "../components/NewsItem/Author";
import NewsContent from "../components/NewsItem/NewsContent";
import Typography from "@mui/material/Typography";
import * as DOMPurify from "dompurify";
import parse from "html-react-parser";
import ItemRating from "../components/Common/ItemRating";
import CommentsList from "../components/Common/CommentsList";
import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import { User } from "../http/User";
import { useRecoilState } from "recoil";
import { userState } from "../store/User";
import Cookies from "js-cookie";

export default function NewsItem() {
	const [user, _] = useRecoilState(userState);

	const { publication, error } = useLoaderData() as {
		publication: Publication & {
			CommentsList?: (Comment & {
				User: User;
			})[];
			AuthoredUser: User;
		};
		error?: ClientError;
	};

	if (error) throw error;

	const allComments =
		publication.CommentsList?.filter((comment) => comment.User.id !== publication.AuthoredUser.id) || [];

	if (publication.violation)
		throw new ClientError(
			403,
			`Публікація була заблокована за порушення правил${
				publication.violation ? `: ${publication.violation_reason}` : ""
			}`
		);

	const [openDialog, setOpenDialog] = useState(false);
	const [alert, setAlert] = useState<{
		title: string;
		message: string;
		severity: AlertColor | undefined;
	}>({ title: "", message: "", severity: undefined });

	const [userComment, setUserComment] = useState(
		publication.CommentsList?.find((comment) => comment.User.id === user?.id)
	);
	const [message, setMessage] = useState("");
	const [rating, setRating] = useState(0);
	const onRate = async (event: FormEvent) => {
		event.preventDefault();

		const token = Cookies.get("token");
		if (!token) {
			setAlert({ title: "Помилка!", message: "Ви не авторизовані!", severity: "error" });
			setOpenDialog(true);
			return;
		}

		const result = await SetCommentRequest(token, publication.id, { content: message, rate: rating }).catch(
			(error) => {
				setAlert({ title: "Помилка!", message: error.message, severity: "error" });
				setOpenDialog(true);
				return undefined;
			}
		);
		if (!result) return;

		setUserComment({ ...result.comment, User: result.user });

		setAlert({ title: "Успіх!", message: result.message, severity: "success" });
		setOpenDialog(true);
	};

	const onDelete = async () => {
		const token = Cookies.get("token");
		if (!token) {
			setAlert({ title: "Помилка!", message: "Ви не авторизовані!", severity: "error" });
			setOpenDialog(true);
			return;
		}

		const result = await DeleteCommentRequest(token, publication.id).catch((error) => {
			setAlert({ title: "Помилка!", message: error.message, severity: "error" });
			setOpenDialog(true);
			return undefined;
		});
		if (!result) return;

		setUserComment(undefined);

		setAlert({ title: "Успіх!", message: result.message, severity: "success" });
		setOpenDialog(true);
	};

	const [contentHeight, setContentHeight] = useState<number>(0);
	const ref = useRef<any>(null);

	useLayoutEffect(() => {
		if (ref.current) {
			const height = ref.current.getBoundingClientRect().height;
			setContentHeight(height);
		}
	}, []);

	document.title =
		`${publication.AuthoredUser.firstName} ${publication.AuthoredUser.lastName} / ` +
		`${publication.title} — gigashop`;

	const cleanContent = DOMPurify.sanitize(publication.content, {
		USE_PROFILES: { html: true },
	});

	return (
		<>
			<Container sx={{ mt: "15px", height: "100%" }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "15px",
					}}
				>
					<Author user={publication.AuthoredUser} publicationId={publication.id} />
					<Box>
						<Typography variant='h3' textAlign='center'>
							{publication.title}
						</Typography>
						<Typography variant='subtitle1' textAlign='center'>
							{new Date(publication.createdAt).toLocaleDateString()}
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
					<ItemRating comments={publication.CommentsList} />
					<CommentsList
						comments={allComments}
						userComment={userComment}
						onSubmit={onRate}
						onDelete={onDelete}
						message={{ value: message, setValue: setMessage }}
						rate={{ value: rating, setValue: setRating }}
					/>
				</Box>
			</Container>
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<Alert severity={alert.severity}>
					<AlertTitle>{alert.title}</AlertTitle>
					{alert.message}
				</Alert>
			</Dialog>
		</>
	);
}
