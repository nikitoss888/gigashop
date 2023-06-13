import styled from "@mui/material/styles/styled";
import { Link as RouterLink } from "react-router-dom";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

const Link = styled(Typography)`
	text-decoration: none;
	color: ${(props) => props.theme.colors.secondary};
` as typeof Typography;

export default function LoggedOut() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				gap: "20px",
				justifyContent: {
					xs: "space-between",
					md: "flex-end",
				},
			}}
		>
			<Link variant='h6' component={RouterLink} to='/login'>
				Увійти
			</Link>
			<Link variant='h6' component={RouterLink} to='/register'>
				Зареєструватись
			</Link>
		</Box>
	);
}
