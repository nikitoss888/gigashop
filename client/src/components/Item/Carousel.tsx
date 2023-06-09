import styled from "@mui/material/styles/styled";
import Carousel from "react-material-ui-carousel";

export default styled(Carousel)`
	width: 100%;
	background-color: ${(props) => props.theme.colors.primary};
	border-radius: 5px;
	padding-bottom: 20px;
	div:has(img) {
		display: flex;
		width: 100%;
		align-items: start;
		justify-content: center;
	}
`;
