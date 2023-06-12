import { useLoaderData } from "react-router-dom";
import ClientError from "../ClientError";
import { CreatePublicationRequest, Publication, UpdatePublicationRequest } from "../http/Publications";
import {
	Alert,
	AlertColor,
	AlertTitle,
	Box,
	ButtonGroup,
	Container,
	Dialog,
	FormControlLabel,
	TextField,
} from "@mui/material";
import { FormEvent, ChangeEvent, useState, useRef } from "react";
import Typography from "@mui/material/Typography";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { BodyFont, HeadingFont } from "../styles";
import SubmitButton from "../components/Common/SubmitButton";
import Button from "@mui/material/Button";
import Checkbox from "../components/Form/Checkbox";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { userState } from "../store/User";
import { User } from "../http/User";

export default function NewsForm() {
	const { publication, error } = useLoaderData() as {
		publication?: Publication & {
			AuthoredUser: User;
		};
		error?: ClientError;
	};

	if (error) throw error;

	const [user, _] = useRecoilState(userState);
	if (!user) throw new ClientError(401, "Ви не авторизовані");

	if (publication?.AuthoredUser.id !== user.id) throw new ClientError(403, "Ви не автор цієї публікації");

	document.title =
		(publication ? `Редагування публікації "${publication.title}"` : "Створення публікації") + " — gigashop";

	const [alert, setAlert] = useState<{
		title: string;
		message: string;
		severity: AlertColor | undefined;
	}>({ title: "", message: "", severity: undefined });
	const [openDialog, setOpenDialog] = useState(false);

	const editorRef = useRef<TinyMCEEditor | null>(null);

	const [title, setTitle] = useState<string>(publication?.title || "");
	const [content, setContent] = useState<string>(publication?.content || "");
	const [tags, setTags] = useState<string>(publication?.tags?.join(", ") || "");
	const [hide, setHide] = useState<boolean>(publication?.hide || false);
	const toggleHide = () => setHide(!hide);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const token = Cookies.get("token");
		if (!token) throw new ClientError(401, "Ви не авторизовані");

		let result: Publication | void;
		let error: ClientError | undefined;
		if (publication) {
			result = await UpdatePublicationRequest(token, publication.id, {
				title,
				content,
				tags: tags.split(", "),
				hide,
			}).catch((err) => {
				if (err instanceof ClientError) error = err;
				if (err instanceof Error) error = new ClientError(500, err.message);
				error = new ClientError(500, "Помилка сервера");
			});
		} else {
			result = await CreatePublicationRequest(token, {
				title,
				content,
				tags: tags.split(", "),
				hide,
			}).catch((err) => {
				if (err instanceof ClientError) error = err;
				if (err instanceof Error) error = new ClientError(500, err.message);
				error = new ClientError(500, "Помилка сервера");
			});
		}

		if (error && !result) {
			setAlert({
				severity: "error",
				message: error.message,
				title: `Помилка ${error.status}`,
			});
			setOpenDialog(true);
		}

		if (result) {
			setAlert({
				severity: "success",
				title: "Успіх",
				message: `Публікацію "${title}" ${publication ? "оновлено" : "створено"}`,
			});
			setOpenDialog(true);
		}
	};

	const onReset = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setTitle(publication?.title ?? "");
		setContent(publication?.content ?? "");
		setTags(publication?.tags?.join(", ") ?? "");
	};

	const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);
	};
	const onContentChange = () => {
		if (editorRef.current) setContent(editorRef.current.getContent());
	};
	const onTagsChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTags(event.target.value);
	};

	return (
		<>
			<Container sx={{ mt: "15px", height: "100%" }}>
				<form onSubmit={onSubmit} onReset={onReset}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: "15px",
						}}
					>
						<Box>
							<Typography variant='h6' textAlign='center' component='label' htmlFor='title'>
								Заголовок
							</Typography>
							<TextField
								id='title'
								placeholder='Заголовок'
								variant='outlined'
								value={title}
								onChange={onTitleChange}
								fullWidth
							/>
						</Box>
						<Box>
							<Typography variant='h6' textAlign='center' component='label' htmlFor='tags'>
								Теги
							</Typography>
							<TextField
								id='tags'
								placeholder='Теги'
								variant='outlined'
								value={tags}
								onChange={onTagsChange}
								fullWidth
							/>
						</Box>
						<FormControlLabel
							control={<Checkbox id='hide' checked={hide} onChange={toggleHide} />}
							label='Приховати?'
						/>
						<Box>
							<Typography variant='h6' textAlign='center' component='label' htmlFor='content'>
								Контент
							</Typography>
							<Editor
								onInit={(_, editor) => (editorRef.current = editor)}
								value={content}
								init={{
									plugins: [
										"a11ychecker",
										"advlist",
										"advcode",
										"advtable",
										"autolink",
										"checklist",
										"export",
										"lists",
										"link",
										"image",
										"charmap",
										"preview",
										"anchor",
										"searchreplace",
										"visualblocks",
										"powerpaste",
										"fullscreen",
										"formatpainter",
										"insertdatetime",
										"media",
										"table",
										"help",
										"wordcount",
									],
									content_style: `body, p, span { font-family: ${BodyFont}; } h1, h2, h3, h4, h5, h6 { font-family: ${HeadingFont}; }`,
								}}
								onEditorChange={onContentChange}
							/>
						</Box>
						<ButtonGroup fullWidth>
							<SubmitButton type='submit' variant='outlined'>
								Зберегти
							</SubmitButton>
							<Button type='reset' variant='outlined'>
								Скинути
							</Button>
						</ButtonGroup>
					</Box>
				</form>
			</Container>
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<Alert severity={alert.severity}>
					<AlertTitle>{alert.title}</AlertTitle>
					{alert.message}
				</Alert>
			</Dialog>
		</>
	);
}
