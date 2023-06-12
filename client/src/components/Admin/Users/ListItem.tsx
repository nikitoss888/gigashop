import {
	Accordion,
	AccordionSummary,
	Alert,
	AlertColor,
	AlertTitle,
	Box,
	Dialog,
	IconButton,
	MenuItem,
	Select,
	SelectChangeEvent,
	Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetailsStyle from "../../Common/AccordionDetailsStyle";
import { Link } from "react-router-dom";
import { RemoveRedEye } from "@mui/icons-material";
import { User } from "../../../http/User";
import { useState } from "react";
import Cookies from "js-cookie";
import { SetRoleRequest } from "../../../http/Moderation";

type ListItemProps = {
	user: User;
};
export default function ListItem({ user }: ListItemProps) {
	const [role, setRole] = useState(user.role);

	const [alert, setAlert] = useState<{
		title: string;
		message: string;
		severity: AlertColor | undefined;
	}>({ title: "", message: "", severity: undefined });
	const [openDialog, setOpenDialog] = useState(false);

	const changeRole = async (event: SelectChangeEvent<string>) => {
		const token = Cookies.get("token");
		if (!token) {
			setAlert({
				title: "Помилка",
				message: "Ви не авторизовані",
				severity: "error",
			});
			setOpenDialog(true);
			return;
		}

		const result = await SetRoleRequest(token, user.id, event.target.value as "MODERATOR" | "USER").catch(
			(error) => {
				setAlert({
					title: "Помилка",
					message: error.message,
					severity: "error",
				});
				setOpenDialog(true);
				return undefined;
			}
		);
		if (!result) return;

		setAlert({
			title: "Успіх",
			message: result.message,
			severity: "success",
		});
		setOpenDialog(true);
		setRole(result.result.role);
	};

	return (
		<>
			<Accordion disableGutters>
				<AccordionSummary expandIcon={<ExpandMoreIcon color='primary' fontSize='large' />}>
					<Typography variant='h6'>
						{user.firstName} {user.lastName} ({user.login})
					</Typography>
				</AccordionSummary>
				<AccordionDetailsStyle>
					<Box
						sx={{
							display: "flex",
							gap: "10px",
						}}
					>
						<Tooltip title={`Відкрити користувача`}>
							<IconButton component={Link} to={`/admin/items/${user.id}`}>
								<RemoveRedEye sx={{ color: "primary.main" }} />
							</IconButton>
						</Tooltip>
					</Box>
					<Box>
						<Typography variant='h6'>Зареєстровано:</Typography>
						<Typography variant='body1'>{user.createdAt.toString()}</Typography>
					</Box>
					<Box>
						<Typography variant='h6'>Роль:{role === "admin" ? ` ${role}` : ""}</Typography>
						{role !== "admin" && (
							<Select
								labelId='role'
								id='role'
								value={role}
								onChange={changeRole}
								label='Роль'
								sx={{ minWidth: "100px" }}
							>
								<MenuItem value='MODERATOR'>Модератор</MenuItem>
								<MenuItem value='USER'>Користувач</MenuItem>
							</Select>
						)}
					</Box>
				</AccordionDetailsStyle>
			</Accordion>
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<Alert severity={alert.severity}>
					<AlertTitle>{alert.title}</AlertTitle>
					{alert.message}
				</Alert>
			</Dialog>
		</>
	);
}
