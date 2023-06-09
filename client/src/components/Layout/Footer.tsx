import styled from "@mui/material/styles/styled";
import { Box, Container } from "@mui/material";
import { ReactNode } from "react";

const FooterStyle = styled(Box)`
	grid-area: footer;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${(props) => props.theme.colors.primary};
	color: ${(props) => props.theme.colors.secondary};
	position: relative;
`;

const FooterContainer = styled(Container)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

type FooterComponentProps = {
	children: ReactNode;
};
const FooterComponent = ({ children }: FooterComponentProps) => (
	<FooterStyle component='footer'>
		<FooterContainer maxWidth='lg'>{children}</FooterContainer>
	</FooterStyle>
);

export default function Footer() {
	return (
		<FooterComponent>
			<Box>
				© 2023-{new Date().getFullYear()} {process.env.REACT_APP_PROJECT_NAME}
			</Box>
		</FooterComponent>
	);
}
