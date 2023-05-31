import styled from "@mui/material/styles/styled";
import { type ReactNode, useState } from "react";
import logo from "../../static/logo.png";
import { Typography, AppBar, Menu, MenuItem, Container, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LoggedIn from "./LoggedIn";
import { userState } from "../../store/User";
import { useRecoilState } from "recoil";
import LoggedOut from "./LoggedOut";

const Logo = styled("img")`
	height: 45px;
	margin-top: 15px;
	margin-bottom: 15px;
`;

const Nav = styled("nav")`
	display: flex;
	gap: 25px;
	align-items: center;
	margin-left: 25px;
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
`;

const HeaderContainer = styled(Container)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: start;
`;

type HeaderComponentProps = {
	children: ReactNode;
};
const HeaderComponent = ({ children }: HeaderComponentProps) => (
	<HeaderStyle>
		<HeaderContainer maxWidth='lg'>{children}</HeaderContainer>
	</HeaderStyle>
);

type HeaderProps = {
	admin?: boolean;
};

export default function Header({ admin }: HeaderProps) {
	const [user, _] = useRecoilState(userState);
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
			<Link
				variant='h5'
				component={RouterLink}
				to={"/" + (admin ? "admin" : "")}
				noWrap
				sx={{
					fontWeight: "bold",
					marginLeft: "25px",
				}}
			>
				{title}
			</Link>
			<Nav>
				<Link component={RouterLink} to='/' variant='h6'>
					Домашня сторінка
				</Link>
				{admin ? undefined : (
					<>
						<Link
							id='shop-dropdown'
							aria-controls={shopOpen ? "shop-menu" : undefined}
							aria-haspopup='true'
							aria-expanded={shopOpen ? "true" : undefined}
							onMouseOver={handleShopMenuOpen}
							variant='h6'
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
								<Typography variant='h6'>Товари</Typography>
							</MenuItem>
							<MenuItem component={RouterLink} to='/shop/genres'>
								<Typography variant='h6'>Жанри</Typography>
							</MenuItem>
							<MenuItem component={RouterLink} to='/shop/companies'>
								<Typography variant='h6'>Компанії</Typography>
							</MenuItem>
						</Menu>
						<Link component={RouterLink} to='/news' variant='h6'>
							Новини
						</Link>
					</>
				)}
			</Nav>
			<Box sx={{ marginLeft: "auto" }}>{user ? <LoggedIn /> : <LoggedOut />}</Box>
		</HeaderComponent>
	);
}
