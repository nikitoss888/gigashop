import { Item } from "../../../http/Items";
import { Accordion, AccordionSummary, Box, IconButton, Tooltip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetailsStyle from "../../Common/AccordionDetailsStyle";
import { Link } from "react-router-dom";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";

type ListItemProps = {
	item: Item;
	onDelete: (id: number) => void;
};
export default function ListItem({ item, onDelete }: ListItemProps) {
	return (
		<Accordion disableGutters>
			<AccordionSummary expandIcon={<ExpandMoreIcon color='primary' fontSize='large' />}>
				<Typography variant='h6'>
					{item.name} (№{item.id})
				</Typography>
			</AccordionSummary>
			<AccordionDetailsStyle>
				<Box
					sx={{
						display: "flex",
						gap: "10px",
					}}
				>
					<Tooltip title={`Відкрити товар`}>
						<IconButton component={Link} to={`/admin/items/${item.id}`}>
							<RemoveRedEye sx={{ color: "primary.main" }} />
						</IconButton>
					</Tooltip>
					<Tooltip title={`Редагувати товар`}>
						<IconButton component={Link} to={`/admin/items/${item.id}/edit`}>
							<Edit sx={{ color: "primary.main" }} />
						</IconButton>
					</Tooltip>
					<Tooltip title={`Видалити товар`}>
						<IconButton onClick={() => onDelete(item.id)}>
							<Delete color='error' />
						</IconButton>
					</Tooltip>
				</Box>
				<Box>
					<Typography variant='h6'>Дата випуску:</Typography>
					<Typography variant='body1'>{item.releaseDate.toString()}</Typography>
				</Box>
				<Box>
					<Typography variant='h6'>Ціна:</Typography>
					<Typography variant='body1'>{item.price}</Typography>
				</Box>
				<Box>
					<Typography variant='h6'>Кількість:</Typography>
					<Typography variant='body1'>{item.amount}</Typography>
				</Box>
			</AccordionDetailsStyle>
		</Accordion>
	);
}
