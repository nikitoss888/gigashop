import { Container } from "@mui/material";
import styled from "@mui/material/styles/styled";

export default styled(Container)`
	display: grid;
	grid-template-rows: repeat(auto-fill, 1fr);
	grid-gap: 5px 20px;
`;
