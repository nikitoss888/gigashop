import styled from "@mui/material/styles/styled";
import { Menu, MenuItem, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { MouseEvent, useState } from "react";
import Link from "./Link";

const Nav = styled("nav")`
	display: flex;
	gap: 25px;
	align-items: center;
	margin-left: 25px;
`;

type HeaderMdNavProps = {
	isAdminRoute?: boolean;
};
export default function HeaderMdNav({ isAdminRoute }: HeaderMdNavProps) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const shopOpen = Boolean(anchorEl);

	const handleShopMenuOpen = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleShopMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<Nav>
			{isAdminRoute ? undefined : (
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
						Публікації
					</Link>
				</>
			)}
		</Nav>
	);
}
