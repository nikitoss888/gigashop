import { Chip } from "@mui/material";
import styled from "@mui/material/styles/styled";

export default styled(Chip)`
	background-color: ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.secondary};
` as typeof Chip;
