import { MouseEvent } from "react";
import { Button, Divider, Menu, MenuItem, Typography } from "@mui/material";
import styled from "@mui/material/styles/styled";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useState } from "react";
import { UserAtom, userState } from "../../store/User";
import { useRecoilState } from "recoil";
import { LogOut } from "../../store/User";

const Avatar = styled("img")`
	width: 45px;
	aspect-ratio: 1;
	border-radius: 50%;
	object-fit: cover;
	object-position: top;
`;
type LoggedInMdProps = {
	user: UserAtom;
};
export default function LoggedInMd({ user }: LoggedInMdProps) {
	const [_, setUser] = useRecoilState(userState);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const open = Boolean(anchorEl);
	const clickHandler = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const closeHandler = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				sx={{
					display: "flex",
					alignItems: "center",
					gap: "10px",
					"&:hover": {
						cursor: "pointer",
					},
				}}
				id='user-menu'
				aria-controls={open ? "user-menu" : undefined}
				aria-haspopup='true'
				aria-expanded={open ? "true" : undefined}
				onClick={clickHandler}
			>
				<Avatar src={user.image} alt={user.login} />
				<Typography
					variant='h6'
					color='secondary'
					sx={{
						textTransform: "none",
					}}
				>
					{user.login}
				</Typography>
				<MenuIcon color='secondary' />
			</Button>
			<Menu
				id='user-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={closeHandler}
				MenuListProps={{
					"aria-labelledby": "user-menu",
				}}
			>
				<MenuItem component={Link} to='/profile'>
					<Typography variant='h6'>Профіль</Typography>
				</MenuItem>
				<MenuItem component={Link} to='/cart'>
					<Typography variant='h6'>Кошик</Typography>
				</MenuItem>
				<MenuItem onClick={() => LogOut(setUser)}>
					<Typography variant='h6'>Вийти</Typography>
				</MenuItem>
				{["admin", "moderator"].includes(user.role.toLowerCase()) && (
					<Divider sx={{ borderColor: "primary.main" }} />
				)}
				{["admin", "moderator"].includes(user.role.toLowerCase()) && (
					<MenuItem component={Link} to='/admin'>
						<Typography variant='h6'>Адміністративна панель</Typography>
					</MenuItem>
				)}
			</Menu>
		</>
	);
}
