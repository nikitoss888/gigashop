import {
	Accordion,
	AccordionSummary,
	Alert,
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
import { PublicationComment } from "../../../mock/PublicationsComments";
import { useState } from "react";
import SubmitButton from "../../Common/SubmitButton";

type ListItemProps = {
	comment: PublicationComment;
	linkToPublication?: boolean;
	linkToUser?: boolean;
};
export default function ListItem({ comment, linkToPublication, linkToUser }: ListItemProps) {
	const [hide, _] = useState(comment.hide || false);
	const [violation, setViolation] = useState(comment.violation || false);
	const [violationReason, setViolationReason] = useState<string>(comment.violation_reason || "");
	const [violationSet, setViolationSet] = useState(true);
	const [alertOpen, setAlertOpen] = useState(false);

	const toggleViolation = () => {
		console.log({ violation: !violation });
		setViolation(!violation);
	};

	const sendViolation = () => {
		setViolationSet(true);
		console.log({
			violation,
			violation_reason: violation ? violationReason : null,
		});
		setAlertOpen(true);
	};

	return (
		<>
			<Accordion disableGutters>
				<AccordionSummary expandIcon={<ExpandMoreIcon color='primary' fontSize='large' />}>
					<Typography variant='h6'>
						Коментар #{comment.id} до публікації #{comment.publicationId}
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
						Автор: {comment.user?.firstName} {comment.user?.lastName} ({comment.user?.login})
					</Typography>
					<Typography
						variant='h6'
						{...(linkToPublication && {
							component: Link,
							to: `/admin/news/${comment.publicationId}`,
						})}
						sx={{
							color: "primary.main",
						}}
					>
						Публікація: {comment.publication?.title}
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
			<Dialog open={alertOpen} onClose={() => setAlertOpen(false)}>
				<Alert severity='success' onClose={() => setAlertOpen(false)}>
					<AlertTitle>Успіх</AlertTitle>
					Порушення до коментаря #{comment.id} публікації #{comment.publicationId} змінено!
				</Alert>
			</Dialog>
		</>
	);
}
