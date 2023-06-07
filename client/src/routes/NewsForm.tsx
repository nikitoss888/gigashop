import { useParams } from "react-router-dom";
import HTTPError from "../HTTPError";
import Publications, { Publication } from "../mock/Publications";
import { Box, ButtonGroup, Container, TextField } from "@mui/material";
import { FormEvent, ChangeEvent, useState, useRef } from "react";
import Typography from "@mui/material/Typography";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { BodyFont, HeadingFont } from "../styles";
import SubmitButton from "../components/Common/SubmitButton";
import Button from "@mui/material/Button";

export default function NewsForm() {
	const { id } = useParams();

	let publication: Publication | undefined;
	if (id) {
		const parsed = parseInt(id);
		if (isNaN(parsed)) throw new HTTPError(400, "ID публікації не є числом");

		publication = Publications.find((publication) => publication.id === parsed);
		if (!publication) throw new HTTPError(404, "Публікацію за даним ID не знайдено");
	}

	document.title =
		(publication ? `Редагування публікації "${publication.title}"` : "Створення публікації") + " — gigashop";

	const editorRef = useRef<TinyMCEEditor | null>(null);

	const [title, setTitle] = useState<string>(publication?.title || "");
	const [content, setContent] = useState<string>(publication?.content || "");
	const [tags, setTags] = useState<string>(publication?.tags?.join(", ") || "");

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const tagsArr = tags
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0);
		console.log({ title, content, tagsArr });
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
	);
}
