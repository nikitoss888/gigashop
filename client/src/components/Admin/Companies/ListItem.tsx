import { Accordion, AccordionSummary, Box, IconButton, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { Company } from "../../../mock/Companies";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetailsStyle from "../../Common/AccordionDetailsStyle";

type ListItemProps = {
	company: Company;
};
export default function ListItem({ company }: ListItemProps) {
	return (
		<Accordion disableGutters>
			<AccordionSummary expandIcon={<ExpandMoreIcon color='primary' fontSize='large' />}>
				<Typography variant='h6'>
					{company.name} (№{company.id})
				</Typography>
			</AccordionSummary>
			<AccordionDetailsStyle>
				<Box
					sx={{
						display: "flex",
						gap: "10px",
					}}
				>
					<Tooltip title={`Відкрити компанію`}>
						<IconButton component={Link} to={`/admin/companies/${company.id}`}>
							<RemoveRedEye sx={{ color: "primary.main" }} />
						</IconButton>
					</Tooltip>
					<Tooltip title={`Редагувати компанію`}>
						<IconButton component={Link} to={`/admin/companies/${company.id}/edit`}>
							<Edit sx={{ color: "primary.main" }} />
						</IconButton>
					</Tooltip>
					<Tooltip title={`Видалити компанію`}>
						<IconButton>
							<Delete color='error' />
						</IconButton>
					</Tooltip>
				</Box>
				<Box>
					<Typography variant='h6'>Дата випуску:</Typography>
					<Typography variant='body1'>{company.founded.toString()}</Typography>
				</Box>
				<Box>
					<Typography variant='h6'>Директор:</Typography>
					<Typography variant='body1'>{company.director}</Typography>
				</Box>
			</AccordionDetailsStyle>
		</Accordion>
	);
}
