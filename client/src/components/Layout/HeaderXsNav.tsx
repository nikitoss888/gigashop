import { Accordion, AccordionSummary, Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Link from "./Link";
import styled from "@mui/material/styles/styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { User } from "../../store/User";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import AccordionDetailsStyle from "../Common/AccordionDetailsStyle";

const Nav = styled("nav")`
	display: flex;
	flex-direction: column;
	gap: 15px;
	align-items: stretch;
`;

type HeaderXsNavProps = {
	isAdminRoute?: boolean;
	user?: User;
};
export default function HeaderXsNav({ isAdminRoute, user }: HeaderXsNavProps) {
	return (
		<Nav>
			{isAdminRoute ? (
				<Link component={RouterLink} to='/' variant='h6'>
					Назад до користувацького інтерфейсу
				</Link>
			) : (
				<>
					<Accordion
						disableGutters
						sx={{
							backgroundColor: "primary.main",
							color: "secondary.main",
							boxShadow: "none",
						}}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon color='secondary' fontSize='large' />}
							sx={{
								padding: 0,
								"& > *": {
									margin: "0 !important",
								},
								minHeight: "unset",
							}}
						>
							<Typography variant='h6'>Магазин</Typography>
						</AccordionSummary>
						<AccordionDetailsStyle>
							<Typography
								variant='h6'
								component={RouterLink}
								to='/shop/items'
								sx={{
									color: "secondary.main",
									textDecoration: "none",
								}}
							>
								Товари
							</Typography>
							<Typography
								variant='h6'
								component={RouterLink}
								to='/shop/genres'
								sx={{
									color: "secondary.main",
									textDecoration: "none",
								}}
							>
								Жанри
							</Typography>
							<Typography
								variant='h6'
								component={RouterLink}
								to='/shop/companies'
								sx={{
									color: "secondary.main",
									textDecoration: "none",
								}}
							>
								Компанії
							</Typography>
						</AccordionDetailsStyle>
					</Accordion>
					<Link component={RouterLink} to='/news' variant='h6'>
						Публікації
					</Link>
					<Box mt={3}>{user ? <LoggedIn /> : <LoggedOut />}</Box>
				</>
			)}
		</Nav>
	);
}
