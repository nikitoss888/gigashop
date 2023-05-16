import styled from "@emotion/styled/macro";
import { type ReactNode, useState } from "react";
import logo from "../../static/logo.png";
import { Typography, AppBar, Link as MUILink, Menu, MenuItem } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LogInOut from "./LogInOut";

const Logo = styled.img`
	width: 60px;
	margin-block: 15px;
`;

const Nav = styled.nav`
	display: flex;
	height: 100%;
	gap: 25px;
	align-items: center;
	margin-left: 25px;
`;

const Link = styled(MUILink)`
	font-size: 1.2rem;
	text-decoration: none;
	color: ${(props) => props.theme.colors.secondary};
` as typeof MUILink;

const HeaderStyle = styled(AppBar)`
	grid-area: header;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: start;
	padding: 0 100px;
	background-color: ${(props) => props.theme.colors.primary};
	color: ${(props) => props.theme.colors.secondary};
`;

type HeaderComponentProps = {
	children: ReactNode;
};
const HeaderComponent = ({ children }: HeaderComponentProps) => <HeaderStyle>{children}</HeaderStyle>;

type HeaderProps = {
	admin?: boolean;
};

export default function Header({ admin }: HeaderProps) {
	const title = process.env.REACT_APP_PROJECT_NAME + (admin ? " Admin" : "");

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const shopOpen = Boolean(anchorEl);

	const handleShopMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleShopMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<HeaderComponent>
			<Logo src={logo} alt='Logo' />
			<Typography
				variant='h1'
				component={RouterLink}
				to={"/" + (admin ? "admin" : "")}
				noWrap
				color='secondary'
				sx={{
					fontSize: "1.5rem",
					fontWeight: 400,
					marginLeft: "25px",
					textDecoration: "none",
				}}
			>
				{title}
			</Typography>
			<Nav>
				<Link component={RouterLink} to='/'>
					Домашня сторінка
				</Link>
				{admin ? undefined : (
					<>
						<Link
							href='#'
							id='shop-dropdown'
							aria-controls={shopOpen ? "shop-menu" : undefined}
							aria-haspopup='true'
							aria-expanded={shopOpen ? "true" : undefined}
							onMouseOver={handleShopMenuOpen}
						>
							Магазин
						</Link>
						<Menu
							id='shop-menu'
							anchorEl={anchorEl}
							open={shopOpen}
							onClose={handleShopMenuClose}
							MenuListProps={{
								"aria-labelledby": "shop-dropdown",
							}}
						>
							<MenuItem component={RouterLink} to='/shop/items'>
								Товари
							</MenuItem>
							<MenuItem component={RouterLink} to='/shop/genres'>
								Жанри
							</MenuItem>
							<MenuItem component={RouterLink} to='/shop/companies'>
								Компанії
							</MenuItem>
						</Menu>
					</>
				)}
			</Nav>
			<LogInOut />
		</HeaderComponent>
	);
}
