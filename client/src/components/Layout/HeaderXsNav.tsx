import { Accordion, AccordionSummary, Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Link from "./Link";
import styled from "@mui/material/styles/styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { UserAtom } from "../../store/User";
import LoggedInXs from "./LoggedInXs";
// import LoggedOut from "./LoggedOut";
import AccordionDetailsStyle from "../Common/AccordionDetailsStyle";
import LoggedOut from "./LoggedOut";

const Nav = styled("nav")`
	display: flex;
	flex-direction: column;
	gap: 15px;
	align-items: stretch;
`;

type HeaderXsNavProps = {
	isAdminRoute?: boolean;
	user?: UserAtom;
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
								color: "secondary.main",
							}}
						>
							<Typography variant='h6' color='secondary'>
								Магазин
							</Typography>
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
					<Box mt={3}>{user ? <LoggedInXs user={user} /> : <LoggedOut />}</Box>
				</>
			)}
		</Nav>
	);
}
