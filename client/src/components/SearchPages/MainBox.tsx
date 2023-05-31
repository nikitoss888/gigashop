import styled from "@mui/material/styles/styled";
import { Box } from "@mui/material";

export default styled(Box)`
	background-color: ${(props) => props.theme.colors.primary};
	color: ${(props) => props.theme.colors.secondary};
	padding: 15px;
	border-radius: 5px;
	.MuiOutlinedInput-root {
		background-color: ${(props) => props.theme.colors.inputBackground};
	}
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 15px;
`;
