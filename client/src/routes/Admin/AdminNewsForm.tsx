import { useLoaderData } from "react-router-dom";
import { Publication } from "../../mock/Publications";
import ClientError from "../../ClientError";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Editor as TinyMCEEditor } from "tinymce";
import { Alert, AlertTitle, Box, ButtonGroup, Dialog, FormControlLabel, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Editor } from "@tinymce/tinymce-react";
import { BodyFont, HeadingFont } from "../../styles";
import SubmitButton from "../../components/Common/SubmitButton";
import Button from "@mui/material/Button";
import Checkbox from "../../components/Form/Checkbox";

export default function AdminNewsForm() {
	const { publication, error } = useLoaderData() as {
		publication?: Publication;
		error?: ClientError;
	};

	if (error) throw error;

	document.title =
		(publication ? `Редагування публікації "${publication.title}"` : "Створення публікації") +
		" — Адміністративна панель — gigashop";

	const [openDialog, setOpenDialog] = useState(false);

	const editorRef = useRef<TinyMCEEditor | null>(null);

	const [title, setTitle] = useState<string>(publication?.title || "");
	const [content, setContent] = useState<string>(publication?.content || "");
	const [tags, setTags] = useState<string>(publication?.tags?.join(", ") || "");
	const [hide, setHide] = useState<boolean>(publication?.hide || false);
	const toggleHide = () => setHide(!hide);

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const tagsArr = tags
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0);
		console.log({ title, content, tagsArr, hide });
		setOpenDialog(true);
	};

	const onReset = (event: React.FormEvent<HTMLFormElement>) => {
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
			<Box>
				<Typography variant='h4' textAlign='center' mb={3}>
					{publication
						? `Редагування публікації ${publication.title} (№${publication.id})`
						: "Створення публікації"}
				</Typography>
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
			</Box>
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<Alert severity='success'>
					<AlertTitle>Успіх!</AlertTitle>
					Публікацію успішно {publication ? "відредаговано" : "створено"}!
				</Alert>
			</Dialog>
		</>
	);
}
