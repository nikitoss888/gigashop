import { ItemComment } from "../../mock/ItemsComments";
import { Box } from "@mui/material";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import { StarRate } from "@mui/icons-material";

const CommentBox = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: start;
	align-items: center;
	gap: 10px;
`;

const Avatar = styled("img")`
	width: 100%;
	object-fit: cover;
	border-radius: 50%;
`;

type CommentProps = {
	comment: ItemComment;
};
export default function Comment({ comment }: CommentProps) {
	return (
		<CommentBox>
			<Box
				sx={{
					width: {
						xs: "150px",
						md: "100px",
					},
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "start",
					justifyContent: "start",
				}}
			>
				<Avatar src={comment.user?.avatar} alt={comment.user?.login} />
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
				<Typography variant='body1'>{comment.text}</Typography>
				<Box sx={{ display: "flex" }}>
					<Typography variant='body1'>{comment.rate}/5</Typography>
					<StarRate sx={{ color: "accent.main" }} />
				</Box>
			</Box>
		</CommentBox>
	);
}
