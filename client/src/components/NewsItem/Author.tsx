import { Box, IconButton, Tooltip } from "@mui/material";
import { User } from "../../mock/Users";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";

const BoxStyle = styled(Box)`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 15px;
`;

const AvatarBox = styled(Box)`
	display: flex;
	align-items: start;
	justify-content: center;
	width: 80px;
`;

const Avatar = styled("img")`
	width: 100%;
	object-fit: cover;
	aspect-ratio: 1/1;
	border-radius: 50%;
`;

const InfoBox = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: end;
	align-items: start;
`;

type AuthorProps = {
	user: User;
	publicationId: number;
};
export default function Author({ user, publicationId }: AuthorProps) {
	return (
		<BoxStyle>
			<AvatarBox>
				<Avatar src={user.image} alt={user.login} />
			</AvatarBox>
			<InfoBox>
				<Typography variant='h4' component='h3' color='primary'>
					{`${user.firstName} ${user.lastName}`}
				</Typography>
				<Typography
					variant='subtitle2'
					component='h4'
					color={user.role.toLowerCase() === "user" ? "primary" : "accent.main"}
				>
					{user.role}
				</Typography>
			</InfoBox>
			<Box
				sx={{
					display: "flex",
					gap: "10px",
				}}
			>
				<Tooltip title={`Редагувати публікацію`}>
					<IconButton component={Link} to={`/news/${publicationId}/edit`}>
						<Edit sx={{ color: "primary.main" }} />
					</IconButton>
				</Tooltip>
				<Tooltip title={`Видалити публікацію`}>
					<IconButton>
						<Delete color='error' />
					</IconButton>
				</Tooltip>
			</Box>
		</BoxStyle>
	);
}
