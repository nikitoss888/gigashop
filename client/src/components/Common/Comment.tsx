import { ItemRate } from "../../http/Items";
import { Box, Rating } from "@mui/material";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import { StarRate } from "@mui/icons-material";
import { Comment as PublicationComment } from "../../http/Publications";
import { User } from "../../http/User";

const CommentBox = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: start;
	align-items: stretch;
	gap: 10px;
`;

const Avatar = styled("img")`
	width: 100%;
	object-fit: cover;
	aspect-ratio: 1;
	border-radius: 50%;
`;

type CommentProps = {
	comment: ItemRate | PublicationComment;
	user: User;
};
export default function Comment({ comment, user }: CommentProps) {
	return (
		<CommentBox>
			<Box
				sx={{
					width: "70px",
					minWidth: "70px",
					display: "flex",
					flexDirection: "column",
					alignItems: "start",
					justifyContent: "start",
				}}
			>
				<Avatar src={user.image} alt={user.login} />
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "start",
					justifyContent: "start",
					gap: "5px",
					height: "100%",
				}}
			>
				<Typography
					component='h6'
					variant='h6'
					sx={{
						fontWeight: "bold",
						borderBottom: "2px solid",
						borderColor: "primary.main",
					}}
				>
					{user.firstName} {user.lastName}
				</Typography>
				<Typography variant='body1'>{comment.content}</Typography>
				<Box sx={{ display: "flex" }}>
					<Rating
						name='comment-rating'
						value={comment.rate}
						readOnly
						emptyIcon={<StarRate color='disabled' />}
						icon={<StarRate sx={{ color: "accent.main" }} />}
					/>
				</Box>
			</Box>
		</CommentBox>
	);
}
