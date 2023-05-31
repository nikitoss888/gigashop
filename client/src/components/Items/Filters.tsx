import { Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FiltersContent from "./FiltersContent";

const AccordionStyle = styled(Accordion)`
	background-color: ${(props) => props.theme.colors.primary};
	border-radius: 5px;
`;

export default function Filters() {
	return (
		<>
			<Box sx={{ gridRow: 2, display: { xs: "none", md: "block" } }} p={0} m={0}>
				<FiltersContent />
			</Box>
			<AccordionStyle sx={{ display: { md: "none" } }} disableGutters>
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
					<FiltersContent />
				</AccordionDetails>
			</AccordionStyle>
		</>
	);
}
