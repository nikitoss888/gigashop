import { Box } from "@mui/material";
import { User } from "../../mock/Users";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";

const BoxStyle = styled(Box)`
	display: flex;
	flex-direction: row;
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
};
export default function Author({ user }: AuthorProps) {
	return (
		<BoxStyle>
			<AvatarBox>
				<Avatar src={user.avatar} alt={user.login} />
			</AvatarBox>
			<InfoBox>
				<Typography variant='h4' component='h3' color='primary'>
					{`${user.firstName} ${user.lastName}`}
				</Typography>
				<Typography variant='subtitle2' component='h4' color='primary'>
					{user.role}
				</Typography>
			</InfoBox>
		</BoxStyle>
	);
}
