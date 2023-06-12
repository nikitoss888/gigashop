import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import FiltersContent from "./FiltersContent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import { User } from "../../http/User";

const AccordionStyle = styled(Accordion)`
	background-color: ${(props) => props.theme.colors.primary};
	border-radius: 5px;
`;

type FiltersProps = {
	authors: User[];
};
export default function Filters({ authors }: FiltersProps) {
	return (
		<AccordionStyle disableGutters>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon color='secondary' />}
				aria-controls='content'
				id='filters-accordion-header'
			>
				<Typography variant='h6' component='h2' color='secondary'>
					Фільтри
				</Typography>
			</AccordionSummary>
			<AccordionDetails sx={{ padding: 0 }}>
				<FiltersContent authors={authors} />
			</AccordionDetails>
		</AccordionStyle>
	);
}
