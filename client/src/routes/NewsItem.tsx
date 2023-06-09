import { useLoaderData } from "react-router-dom";
import { Publication } from "../mock/Publications";
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

export default function NewsItem() {
	const { publication, error } = useLoaderData() as {
		publication: Publication;
		error: ClientError;
	};

	if (error) throw error;

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

	const [message, setMessage] = useState("");
	const [rating, setRating] = useState(0);
	const onRate = (event: FormEvent) => {
		event.preventDefault();
		console.log("Rated");
		setAlert({ title: "Успіх!", message: "Ваш відгук успішно додано!", severity: "success" });
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
		(publication.user && `${publication.user?.firstName} ${publication.user?.lastName} / `) +
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
					{publication.user && <Author user={publication.user} publicationId={publication.id} />}
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
					{publication.comments && <ItemRating comments={publication.comments} />}
					{publication.comments && (
						<CommentsList
							comments={publication.comments}
							onSubmit={onRate}
							message={{ value: message, setValue: setMessage }}
							rate={{ value: rating, setValue: setRating }}
						/>
					)}
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
