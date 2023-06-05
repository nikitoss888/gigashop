import styled from "@mui/material/styles/styled";
import { Typography } from "@mui/material";

const Link = styled(Typography)`
	text-decoration: none;
	color: ${(props) => props.theme.colors.secondary};
` as typeof Typography;

export default Link;
