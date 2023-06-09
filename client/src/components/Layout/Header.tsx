import styled from "@mui/material/styles/styled";
import { type ReactNode, useState } from "react";
import logo from "../../static/logo.png";
import { Typography, AppBar, Container, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LoggedInMd from "./LoggedInMd";
import { userState } from "../../store/User";
import { useRecoilState } from "recoil";
// import LoggedOut from "./LoggedOut";
import MenuIcon from "@mui/icons-material/Menu";
import HeaderMdNav from "./HeaderMdNav";
import HeaderXsNav from "./HeaderXsNav";
import LoggedOut from "./LoggedOut";

const Logo = styled("img")`
	height: 45px;
	margin-top: 15px;
	margin-bottom: 15px;
`;

const Link = styled(Typography)`
	text-decoration: none;
	color: ${(props) => props.theme.colors.secondary};
` as typeof Typography;

const HeaderStyle = styled(AppBar)`
	grid-area: header;
	background-color: ${(props) => props.theme.colors.primary};
	color: ${(props) => props.theme.colors.secondary};
	box-shadow: none;
` as typeof AppBar;

const HeaderBox = styled(Box)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: start;
` as typeof Box;

type HeaderComponentProps = {
	children: ReactNode;
};
const HeaderComponent = ({ children }: HeaderComponentProps) => (
	<HeaderStyle>
		<Container maxWidth='lg'>{children}</Container>
	</HeaderStyle>
);

type HeaderProps = {
	isAdminRoute?: boolean;
};
export default function Header({ isAdminRoute }: HeaderProps) {
	const [user, _] = useRecoilState(userState);
	const [expanded, setExpanded] = useState<boolean>(false);
	const title = process.env.REACT_APP_PROJECT_NAME + (isAdminRoute ? " Admin" : "");

	return (
		<HeaderComponent>
			<HeaderBox
				sx={{
					display: {
						xs: "none",
						md: "flex",
					},
				}}
			>
				<Logo src={logo} alt='Logo' />
				<Link
					variant='h5'
					component={RouterLink}
					to={"/" + (isAdminRoute ? "admin" : "")}
					noWrap
					sx={{
						fontWeight: "bold",
						marginLeft: "25px",
					}}
				>
					{title}
				</Link>
				<HeaderMdNav isAdminRoute={isAdminRoute} />
				<Box sx={{ marginLeft: "auto" }}>{user ? <LoggedInMd user={user} /> : <LoggedOut />}</Box>
			</HeaderBox>
			<Accordion
				sx={{
					boxShadow: "none",
					display: {
						xs: "block",
						md: "none",
					},
				}}
				expanded={expanded}
				disableGutters
			>
				<AccordionSummary
					expandIcon={<MenuIcon color='secondary' fontSize='large' onClick={() => setExpanded(!expanded)} />}
					sx={{
						padding: 0,
						width: "100%",
						backgroundColor: (theme) => theme.palette.primary.main,
						"& > *": {
							margin: "0 !important",
						},
					}}
				>
					<HeaderBox>
						<Logo src={logo} alt='Logo' />
						<Link
							variant='h5'
							component={RouterLink}
							to={"/" + (isAdminRoute ? "admin" : "")}
							noWrap
							sx={{
								fontWeight: "bold",
								marginLeft: "25px",
							}}
						>
							{title}
						</Link>
					</HeaderBox>
				</AccordionSummary>
				<AccordionDetails
					sx={{
						backgroundColor: (theme) => theme.palette.primary.main,
					}}
				>
					<HeaderXsNav isAdminRoute={isAdminRoute} user={user} />
				</AccordionDetails>
			</Accordion>
		</HeaderComponent>
	);
}
