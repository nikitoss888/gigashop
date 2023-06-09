import styled from "@mui/material/styles/styled";
import { Checkbox as MuiCheckbox } from "@mui/material";

const Checkbox = styled(MuiCheckbox)`
	color: ${(props) => props.theme.colors.accent};
	&.Mui-checked {
		color: ${(props) => props.theme.colors.accent};
	}
` as typeof MuiCheckbox;

export default Checkbox;
