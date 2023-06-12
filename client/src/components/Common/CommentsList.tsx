import { ItemRate } from "../../http/Items";
import { Comment as PublicationComment } from "../../http/Publications";
import Typography from "@mui/material/Typography";
import { Box, Divider, IconButton } from "@mui/material";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import styled from "@mui/material/styles/styled";
import { FormEvent } from "react";
import { User } from "../../http/User";
import { userState } from "../../store/User";
import { useRecoilState } from "recoil";
import Delete from "@mui/icons-material/Delete";

const Form = styled("form")`
	width: 100%;
`;

type CommentsProps = {
	comments?: ((ItemRate & { User: User }) | (PublicationComment & { User: User }))[];
	userComment?: (ItemRate & { User: User }) | (PublicationComment & { User: User });
	onSubmit: (event: FormEvent) => void;
	onDelete: () => void;
	message: {
		value: string;
		setValue: (message: string) => void;
	};
	rate: {
		value: number;
		setValue: (rate: number) => void;
	};
};
export default function CommentsList({ comments, userComment, onSubmit, onDelete, message, rate }: CommentsProps) {
	const [user, _] = useRecoilState(userState);

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
			{user && (
				<Form onSubmit={onSubmit}>
					<CommentInput message={message} rate={rate} />
				</Form>
			)}
			{user && userComment && (
				<>
					<Typography
						component='h6'
						variant='h6'
						pr={3}
						sx={{ fontWeight: "bold", borderBottom: "2px solid", borderColor: "primary.main" }}
					>
						Ваш коментар:
					</Typography>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Comment comment={userComment} user={userComment.User} />
						<IconButton
							onClick={onDelete}
							sx={{
								margin: "20px",
							}}
						>
							<Delete sx={{ color: "accent.main" }} />
						</IconButton>
					</Box>
					<Divider sx={{ border: "2px solid", borderColor: "primary.main" }} />
				</>
			)}
			{comments && comments.map((comment) => <Comment key={comment.id} comment={comment} user={comment.User} />)}
		</Box>
	);
}
