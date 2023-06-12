import { Publication } from "../../../http/Publications";
import { Accordion, AccordionSummary, Box, IconButton, Tooltip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetailsStyle from "../../Common/AccordionDetailsStyle";
import { Link } from "react-router-dom";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { User } from "../../../http/User";
import { useRecoilState } from "recoil";
import { userState } from "../../../store/User";
import ClientError from "../../../ClientError";

type ListItemProps = {
	publication: Publication & { AuthoredUser: User };
	onDelete: (id: number) => void;
};
export default function ListItem({ publication, onDelete }: ListItemProps) {
	const [user, _] = useRecoilState(userState);
	if (!user || !["admin", "moderator"].includes(user.role.toLowerCase())) {
		throw new ClientError(403, "Доступ без авторизації заборонено");
	}
	return (
		<Accordion disableGutters>
			<AccordionSummary expandIcon={<ExpandMoreIcon color='primary' fontSize='large' />}>
				<Typography variant='h6'>
					{publication.title} (№{publication.id})
				</Typography>
			</AccordionSummary>
			<AccordionDetailsStyle>
				<Box
					sx={{
						display: "flex",
						gap: "10px",
					}}
				>
					<Tooltip title={`Відкрити публікацію`}>
						<IconButton component={Link} to={`/admin/news/${publication.id}`}>
							<RemoveRedEye sx={{ color: "primary.main" }} />
						</IconButton>
					</Tooltip>
					{user.id === publication.AuthoredUser.id && (
						<Tooltip title={`Редагувати публікацію`}>
							<IconButton component={Link} to={`/news/${publication.id}/edit`}>
								<Edit sx={{ color: "primary.main" }} />
							</IconButton>
						</Tooltip>
					)}
					{["admin", "moderator"].includes(publication.AuthoredUser.role.toLowerCase()) && (
						<Tooltip title={`Видалити публікацію`}>
							<IconButton onClick={() => onDelete(publication.id)}>
								<Delete color='error' />
							</IconButton>
						</Tooltip>
					)}
				</Box>
				<Box>
					<Typography variant='h6'>Дата створення:</Typography>
					<Typography variant='body1'>{publication.createdAt.toString()}</Typography>
				</Box>
				<Box>
					<Typography variant='h6'>Дата оновлення:</Typography>
					<Typography variant='body1'>{publication.updatedAt?.toString() || "Не оновлювалась"}</Typography>
				</Box>
				<Box>
					<Typography variant='h6'>Порушення?:</Typography>
					<Typography variant='body1'>
						{publication.violation ? publication.violation_reason || "Так" : "Ні"}
					</Typography>
				</Box>
			</AccordionDetailsStyle>
		</Accordion>
	);
}
