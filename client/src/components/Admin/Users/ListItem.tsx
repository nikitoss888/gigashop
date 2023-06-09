import {
	Accordion,
	AccordionSummary,
	Alert,
	Box,
	Dialog,
	FormControlLabel,
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
import { User } from "../../../mock/Users";
import { useState } from "react";
import Checkbox from "../../Form/Checkbox";
import SubmitButton from "../../Common/SubmitButton";

type ListItemProps = {
	user: User;
};
export default function ListItem({ user }: ListItemProps) {
	const [role, setRole] = useState(user.role);
	const [isBlocked, setIsBlocked] = useState(user.isBlocked);
	const [openAlert, setOpenAlert] = useState(false);
	const changeRole = (event: SelectChangeEvent<string>) => {
		setRole(event.target.value);
	};

	const toggleBlock = () => {
		setIsBlocked(!isBlocked);
	};

	const submit = () => {
		setOpenAlert(true);
		console.log({
			role,
			isBlocked,
		});
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
								<MenuItem value='moderator'>Модератор</MenuItem>
								<MenuItem value='user'>Користувач</MenuItem>
							</Select>
						)}
					</Box>
					{role !== "admin" && (
						<>
							<FormControlLabel
								control={<Checkbox id='block' checked={isBlocked} onChange={toggleBlock} />}
								label='Заблокувати?'
							/>
							<SubmitButton onClick={submit}>Зберегти</SubmitButton>
						</>
					)}
				</AccordionDetailsStyle>
			</Accordion>
			<Dialog open={openAlert} onClose={() => setOpenAlert(false)}>
				<Alert onClose={() => setOpenAlert(false)} severity='success'>
					Роль користувача успішно змінено!
				</Alert>
			</Dialog>
		</>
	);
}
