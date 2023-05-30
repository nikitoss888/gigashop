import styled from "@mui/material/styles/styled";
import { Card } from "@mui/material";

export default styled(Card)`
	background-color: ${(props) => props.theme.colors.primary};
	color: ${(props) => props.theme.colors.secondary};
	display: flex;
	flex-direction: column;
	justify-content: start;
`;
