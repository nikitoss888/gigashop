import { Divider, List } from "@mui/material";
import Comment from "../Common/Comment";
import { Link } from "react-router-dom";
import { PublicationComment } from "../../mock/PublicationsComments";
import Typography from "@mui/material/Typography";

type ItemsCartListProps = {
	comments: PublicationComment[];
};
export default function ItemsList({ comments }: ItemsCartListProps) {
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
						<Comment comment={comment} key={comment.id.toString(16)} />
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
