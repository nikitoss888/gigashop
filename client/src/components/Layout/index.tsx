import styled from "@emotion/styled";
import { type ReactNode } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { AdminTheme, RegularTheme } from "../../styles";
import ScrollToTop from "./ScrollToTop";

const LayoutStyle = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 50px 1fr 50px;
	grid-template-areas:
		"header"
		"main"
		"footer";
	height: 100vh;
	position: relative;
`;

type LayoutProps = {
	children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
	const location = useLocation();
	const adminRoute = location.pathname.startsWith("/admin");
	const theme = adminRoute ? AdminTheme : RegularTheme;

	return (
		<ThemeProvider theme={theme}>
			<LayoutStyle>
				<Header isAdminRoute={adminRoute} />
				<Main>{children}</Main>
				<Footer />
				<ScrollToTop />
			</LayoutStyle>
		</ThemeProvider>
	);
}
