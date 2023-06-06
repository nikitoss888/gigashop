import { Item } from "../../../mock/Items";
import { Accordion, AccordionSummary, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import AccordionDetailsStyle from "../../Common/AccordionDetailsStyle";
import { Link } from "react-router-dom";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";

type ListItemProps = {
	item: Item;
};
export default function ListItem({ item }: ListItemProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<Accordion disableGutters expanded={expanded}>
			<AccordionSummary
				expandIcon={
					<ExpandMoreIcon
						color='primary'
						fontSize='large'
						onClick={() => setExpanded(!expanded)}
						sx={{
							cursor: "pointer",
						}}
					/>
				}
				sx={{
					cursor: "default",
					"& > *": {
						cursor: "default",
					},
				}}
			>
				<Typography variant='h6'>{item.name}</Typography>
			</AccordionSummary>
			<AccordionDetailsStyle>
				<Box
					sx={{
						display: "flex",
						gap: "10px",
					}}
				>
					<Link to={`/admin/items/${item.id}`}>
						<RemoveRedEye sx={{ color: "primary.main" }} />
					</Link>
					<Link to={`/admin/items/${item.id}/edit`}>
						<Edit sx={{ color: "primary.main" }} />
					</Link>
					<Link to={`/admin/items/${item.id}/delete`}>
						<Delete color='error' />
					</Link>
				</Box>
				<Box>
					<Typography variant='h6'>Дата випуску:</Typography>
					<Typography variant='body1'>{item.releaseDate.toLocaleDateString()}</Typography>
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
