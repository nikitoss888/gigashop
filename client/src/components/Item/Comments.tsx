import { ItemComment } from "../../mock/ItemsComments";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import Comment from "./Comment";

type CommentsProps = {
	comments: ItemComment[];
};
export default function Comments({ comments }: CommentsProps) {
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
			{comments.map((comment) => (
				<Comment key={comment.id} comment={comment} />
			))}
		</Box>
	);
}
