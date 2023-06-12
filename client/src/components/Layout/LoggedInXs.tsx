import { Accordion, AccordionSummary, Box, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import AccordionDetailsStyle from "../Common/AccordionDetailsStyle";
import { UserAtom } from "../../store/User";

const Avatar = styled("img")`
	width: 45px;
	aspect-ratio: 1;
	border-radius: 50%;
`;
type LoggedInXsProps = {
	user: UserAtom;
};
export default function LoggedInXs({ user }: LoggedInXsProps) {
	return (
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
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						gap: "15px",
					}}
				>
					<Avatar src={user.image} alt={user.login} />
					<Typography variant='h6' color='secondary'>
						{user.login}
					</Typography>
				</Box>
			</AccordionSummary>
			<AccordionDetailsStyle>
				<Typography
					variant='h6'
					component={RouterLink}
					to='/profile'
					sx={{
						color: "secondary.main",
						textDecoration: "none",
					}}
				>
					Профіль
				</Typography>
				<Typography
					variant='h6'
					component={RouterLink}
					to='/profile'
					sx={{
						color: "secondary.main",
						textDecoration: "none",
					}}
				>
					Вийти
				</Typography>
				{["admin", "manager"].includes(user.role.toLowerCase()) && (
					<>
						<Divider
							sx={{
								borderColor: "secondary.main",
							}}
						/>

						<Typography
							variant='h6'
							component={RouterLink}
							to='/admin'
							sx={{
								color: "secondary.main",
								textDecoration: "none",
							}}
						>
							Адміністративна панель
						</Typography>
					</>
				)}
			</AccordionDetailsStyle>
		</Accordion>
	);
}
