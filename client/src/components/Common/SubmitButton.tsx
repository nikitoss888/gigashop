import styled from "@mui/material/styles/styled";
import { Button } from "@mui/material";

const SubmitButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.secondary};
	&:hover {
		background-color: ${(props) => props.theme.colors.accentLight};
	}
	&:disabled {
		background-color: ${(props) => props.theme.colors.accentLighter};
	}
` as typeof Button;

export default SubmitButton;
