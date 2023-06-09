import { ItemRate } from "../../mock/ItemsRates";
import { Box, Rating } from "@mui/material";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import { StarRate } from "@mui/icons-material";
import { PublicationComment } from "../../mock/PublicationsComments";

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
	border-radius: 50%;
`;

type CommentProps = {
	comment: ItemRate | PublicationComment;
};
export default function Comment({ comment }: CommentProps) {
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
				<Avatar src={comment.user?.image} alt={comment.user?.login} />
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
					{comment.user?.firstName} {comment.user?.lastName}
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
