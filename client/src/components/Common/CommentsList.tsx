import { ItemRate } from "../../mock/ItemsRates";
import { PublicationComment } from "../../mock/PublicationsComments";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import styled from "@mui/material/styles/styled";
import { FormEvent } from "react";

const Form = styled("form")`
	width: 100%;
`;

type CommentsProps = {
	comments: (ItemRate | PublicationComment)[];
	onSubmit: (event: FormEvent) => void;
	message: {
		value: string;
		setValue: (message: string) => void;
	};
	rate: {
		value: number;
		setValue: (rate: number) => void;
	};
};
export default function CommentsList({ comments, onSubmit, message, rate }: CommentsProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "start",
				gridColumn: {
					xs: 1,
					sm: "1 / 3",
				},
				gap: "10px",
			}}
		>
			<Typography
				component='h6'
				variant='h6'
				pr={3}
				sx={{ fontWeight: "bold", borderBottom: "2px solid", borderColor: "primary.main" }}
			>
				Коментарі:
			</Typography>
			<Form onSubmit={onSubmit}>
				<CommentInput message={message} rate={rate} />
			</Form>
			{comments.map((comment) => (
				<Comment key={comment.id} comment={comment} />
			))}
		</Box>
	);
}
