import { Publication } from "../../../mock/Publications";
import { Accordion, AccordionSummary, Box, IconButton, Tooltip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetailsStyle from "../../Common/AccordionDetailsStyle";
import { Link } from "react-router-dom";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";

type ListItemProps = {
	publication: Publication;
};
export default function ListItem({ publication }: ListItemProps) {
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
					<Tooltip title={`Редагувати публікацію`}>
						<IconButton component={Link} to={`/admin/news/${publication.id}/edit`}>
							<Edit sx={{ color: "primary.main" }} />
						</IconButton>
					</Tooltip>
					<Tooltip title={`Видалити публікацію`}>
						<IconButton>
							<Delete color='error' />
						</IconButton>
					</Tooltip>
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
