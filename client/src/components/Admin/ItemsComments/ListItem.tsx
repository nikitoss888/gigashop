import {
	Accordion,
	AccordionSummary,
	Alert,
	AlertColor,
	AlertTitle,
	Box,
	Dialog,
	IconButton,
	TextField,
	Tooltip,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Error, SettingsBackupRestore } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetailsStyle from "../../Common/AccordionDetailsStyle";
import { useState } from "react";
import SubmitButton from "../../Common/SubmitButton";
import { ItemRate } from "../../../http/Items";
import { User } from "../../../http/User";
import Cookies from "js-cookie";
import ClientError from "../../../ClientError";
import { SetRateViolationRequest } from "../../../http/Moderation";
import { AxiosError } from "axios";

type ListItemProps = {
	comment: ItemRate & {
		User: User;
	};
	linkToItem?: boolean;
	linkToUser?: boolean;
};
export default function ListItem({ comment, linkToItem, linkToUser }: ListItemProps) {
	const [hide, setHide] = useState(comment.hide || false);
	const [violation, setViolation] = useState(comment.violation || false);
	const [violationReason, setViolationReason] = useState<string>(comment.violation_reason || "");
	const [violationSet, setViolationSet] = useState(true);

	const [alert, setAlert] = useState<{
		title: string;
		message: string;
		severity: AlertColor | undefined;
	}>({ title: "", message: "", severity: undefined });
	const [openDialog, setOpenDialog] = useState(false);

	const token = Cookies.get("token");
	if (!token) throw new ClientError(403, "Ви не авторизовані");

	const toggleViolation = () => {
		setViolation(!violation);
		setViolationSet(false);
	};

	const sendViolation = async () => {
		const result = await SetRateViolationRequest(token, comment.id, {
			violation: violation,
			violation_reason: violationReason,
		}).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});

		if (result instanceof ClientError) {
			setAlert({
				title: "Помилка",
				message: result.message,
				severity: "error",
			});
			setOpenDialog(true);
			return;
		}

		setAlert({
			title: "Успіх",
			message: result.message,
			severity: "success",
		});
		setOpenDialog(true);
		setViolation(result.result.violation);
		setHide(result.result.hide);
	};

	return (
		<>
			<Accordion disableGutters>
				<AccordionSummary expandIcon={<ExpandMoreIcon color='primary' fontSize='large' />}>
					<Typography variant='h6'>
						Коментар #{comment.id} до товару #{comment.itemId}
					</Typography>
				</AccordionSummary>
				<AccordionDetailsStyle>
					<Box
						sx={{
							display: "flex",
							gap: "10px",
						}}
					>
						{violation ? (
							<Tooltip title={`Зняти порушення`}>
								<IconButton onClick={toggleViolation}>
									<SettingsBackupRestore sx={{ color: "primary.main" }} />
								</IconButton>
							</Tooltip>
						) : (
							<Tooltip title={`Встановити порушення`}>
								<IconButton onClick={toggleViolation}>
									<Error sx={{ color: "accent.main" }} />
								</IconButton>
							</Tooltip>
						)}
					</Box>
					{violation && (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Typography variant='h6' color='accent.main'>
								Зміст порушення:
							</Typography>
							<TextField
								name='violation_reason'
								id='violation_reason'
								value={violationReason}
								onChange={(e) => {
									setViolationReason(e.target.value);
									setViolationSet(false);
								}}
								sx={{
									mb: 1,
								}}
							/>
							<SubmitButton onClick={sendViolation} disabled={violationSet}>
								Зберегти
							</SubmitButton>
						</Box>
					)}
					<Typography
						variant='h6'
						{...(linkToUser && {
							component: Link,
							to: `/admin/users/${comment.userId}`,
						})}
						sx={{
							color: "primary.main",
						}}
					>
						Автор: {comment.User?.firstName} {comment.User?.lastName} ({comment.User?.login})
					</Typography>
					<Typography
						variant='h6'
						{...(linkToItem && {
							component: Link,
							to: `/admin/items/${comment.itemId}`,
						})}
						sx={{
							color: "primary.main",
						}}
					>
						Товар: {comment.id}
					</Typography>
					<Box>
						<Typography variant='h6'>Створено:</Typography>
						<Typography variant='body1'>{comment.createdAt.toString()}</Typography>
					</Box>
					{comment.updatedAt && (
						<Box>
							<Typography variant='h6'>Оновлено:</Typography>
							<Typography variant='body1'>{comment.updatedAt.toString()}</Typography>
						</Box>
					)}
					<Box>
						<Typography variant='h6'>Оцінка:</Typography>
						<Typography variant='body1'>{comment.rate}</Typography>
					</Box>
					<Box>
						<Typography variant='h6'>Зміст:</Typography>
						<Typography variant='body1'>{comment.content}</Typography>
					</Box>
					<Typography variant='h6'>Приховано?: {hide ? "Так" : "Ні"}</Typography>
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
