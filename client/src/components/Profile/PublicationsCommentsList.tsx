import { Divider, List } from "@mui/material";
import Comment from "../Common/Comment";
import { Link } from "react-router-dom";
import { Comment as PublicationComment } from "../../http/Publications";
import Typography from "@mui/material/Typography";
import { User } from "../../http/User";

type ItemsCartListProps = {
	comments: PublicationComment[];
	user: User;
};
export default function ItemsList({ comments, user }: ItemsCartListProps) {
	return (
		<List
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
				gap: "10px",
			}}
		>
			{comments.map((comment, index) => (
				<>
					<Link to={`/news/${comment.publicationId}`} style={{ textDecoration: "none" }}>
						<Comment comment={comment} user={user} key={comment.id.toString(16)} />
						{comment.violation && (
							<Typography variant='body1' color='error' mt={2}>
								Порушення: {comment.violation_reason}
								<br />
								Цей коментар не враховується у середній оцінці публікації.
							</Typography>
						)}
					</Link>
					{index < comments.length - 1 && <Divider sx={{ borderColor: "primary.main" }} />}
				</>
			))}
		</List>
	);
}
