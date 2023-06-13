import { Accordion, AccordionSummary, Box, Container, Typography } from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router-dom";
import styled from "@mui/material/styles/styled";
import AccordionDetailsStyle from "../../components/Common/AccordionDetailsStyle";
import { useRecoilState } from "recoil";
import { userState } from "../../store/User";
import ClientError from "../../ClientError";

const AccordionLink = styled(Typography)`
	text-decoration: none;
	color: ${(props) => props.theme.palette.primary.main};
	&:hover {
		text-decoration: underline;
	}
` as typeof Typography;

export default function AdminBase() {
	document.title = "Адміністративна панель - gigashop";

	const [user, _] = useRecoilState(userState);
	if (!user || user.role !== "ADMIN") {
		throw new ClientError(403, "Ви не маєте доступу до цієї сторінки");
	}
	return (
		<Container sx={{ mt: "15px", height: "100%" }}>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "1fr",
						md: "1fr 4fr",
					},
					gap: "15px",
				}}
			>
				<Box sx={{ height: "100%" }}>
					<Accordion disableGutters>
						<AccordionSummary>
							<Typography variant='h6' color='accent.main'>
								Головна
							</Typography>
						</AccordionSummary>
						<AccordionDetailsStyle>
							<AccordionLink variant='h6' component={RouterLink} to='/admin'>
								Головна
							</AccordionLink>
							<AccordionLink variant='h6' component={RouterLink} to='/admin/statistics'>
								Статистика
							</AccordionLink>
						</AccordionDetailsStyle>
					</Accordion>
					<Accordion disableGutters>
						<AccordionSummary>
							<Typography variant='h6' color='accent.main'>
								Користувачі
							</Typography>
						</AccordionSummary>
						<AccordionDetailsStyle>
							<AccordionLink variant='h6' component={RouterLink} to='/admin/users'>
								Всі користувачі
							</AccordionLink>
						</AccordionDetailsStyle>
					</Accordion>
					<Accordion disableGutters>
						<AccordionSummary>
							<Typography variant='h6' color='accent.main'>
								Товари
							</Typography>
						</AccordionSummary>
						<AccordionDetailsStyle>
							<AccordionLink variant='h6' component={RouterLink} to='/admin/items'>
								Всі товари
							</AccordionLink>
							<AccordionLink variant='h6' component={RouterLink} to='/admin/items/create'>
								Новий товар
							</AccordionLink>
						</AccordionDetailsStyle>
					</Accordion>
					<Accordion disableGutters>
						<AccordionSummary>
							<Typography variant='h6' color='accent.main'>
								Компанії
							</Typography>
						</AccordionSummary>
						<AccordionDetailsStyle>
							<AccordionLink variant='h6' component={RouterLink} to='/admin/companies'>
								Всі компанії
							</AccordionLink>
							<AccordionLink variant='h6' component={RouterLink} to='/admin/companies/create'>
								Нова компанія
							</AccordionLink>
						</AccordionDetailsStyle>
					</Accordion>
					<Accordion disableGutters>
						<AccordionSummary>
							<Typography variant='h6' color='accent.main'>
								Жанри
							</Typography>
						</AccordionSummary>
						<AccordionDetailsStyle>
							<AccordionLink variant='h6' component={RouterLink} to='/admin/genres'>
								Всі жанри
							</AccordionLink>
							<AccordionLink variant='h6' component={RouterLink} to='/admin/genres/create'>
								Новий жанр
							</AccordionLink>
						</AccordionDetailsStyle>
					</Accordion>
					<Accordion disableGutters>
						<AccordionSummary>
							<Typography variant='h6' color='accent.main'>
								Публікації
							</Typography>
						</AccordionSummary>
						<AccordionDetailsStyle>
							<AccordionLink variant='h6' component={RouterLink} to='/admin/news'>
								Всі публікації
							</AccordionLink>
							<AccordionLink variant='h6' component={RouterLink} to='/news/create'>
								Нова публікація
							</AccordionLink>
						</AccordionDetailsStyle>
					</Accordion>
					<Accordion disableGutters>
						<AccordionSummary>
							<Typography variant='h6' color='accent.main'>
								Коментарі
							</Typography>
						</AccordionSummary>
						<AccordionDetailsStyle>
							<AccordionLink variant='h6' component={RouterLink} to='/admin/comments/news'>
								Коментарі до публікацій
							</AccordionLink>
							<AccordionLink variant='h6' component={RouterLink} to='/admin/comments/items'>
								Коментарі до товарів
							</AccordionLink>
						</AccordionDetailsStyle>
					</Accordion>
				</Box>
				<Outlet />
			</Box>
		</Container>
	);
}
