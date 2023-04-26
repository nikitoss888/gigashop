import styled from "@emotion/styled";
import { type ReactNode } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { AdminTheme, RegularTheme } from "../../styles";

const LayoutStyle = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 50px 1fr 50px;
	grid-template-areas:
		"header"
		"main"
		"footer";
	height: 100vh;
`;

type LayoutProps = {
	children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
	const location = useLocation();
	const admin = location.pathname.startsWith("/admin");
	const theme = admin ? AdminTheme : RegularTheme;

	return (
		<ThemeProvider theme={theme}>
			<LayoutStyle>
				<Header admin={admin} />
				<Main>{children}</Main>
				<Footer />
			</LayoutStyle>
		</ThemeProvider>
	);
}
