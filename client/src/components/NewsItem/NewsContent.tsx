import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import { BodyFont, HeadingFont } from "../../styles";

const NewsContent = styled(Typography)`
	white-space: pre-wrap;
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		color: inherit;
		font: ${HeadingFont};
		text-align: center;
	}
	p {
		color: inherit;
		font: ${BodyFont};
		text-indent: 1em;
	}
` as typeof Typography;

export default NewsContent;
