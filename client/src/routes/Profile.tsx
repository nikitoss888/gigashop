import { User } from "../mock/Users";
import { Box, Container, Divider, Tab, Tabs, Avatar } from "@mui/material";
import Typography from "@mui/material/Typography";
import { SyntheticEvent, useState } from "react";
import { useLoaderData } from "react-router-dom";
import TabPanel from "../components/Profile/TabPanel";
import ItemsList from "../components/Profile/ItemsList";
import PublicationsList from "../components/Profile/PublicationsList";
import ItemsRatesList from "../components/Profile/ItemsRatesList";
import PublicationsCommentsList from "../components/Profile/PublicationsCommentsList";
import { Item } from "../mock/Items";
import { Publication } from "../mock/Publications";
import { ItemRate } from "../mock/ItemsRates";
import { PublicationComment } from "../mock/PublicationsComments";
import ClientError from "../ClientError";
function a11yProps(index: number) {
	return {
		id: `profile-tab-${index}`,
		"aria-controls": `profile-tabpanel-${index}`,
	};
}

export default function Profile() {
	const { user, wishlist, publications, publicationsComments, itemsRates } = useLoaderData() as {
		user: User;
		wishlist: Item[];
		publications: Publication[];
		publicationsComments: PublicationComment[];
		itemsRates: ItemRate[];
		error?: ClientError;
	};

	document.title = `Профіль користувача ${user.login} — gigashop`;

	const [tab, setTab] = useState(0);
	const tabChange = (_: SyntheticEvent, newValue: number) => {
		setTab(newValue);
	};

	return (
		<Container sx={{ marginTop: "15px", height: "100%" }}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "15px",
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: "15px",
					}}
				>
					<Avatar
						src={user.image}
						alt={user.login}
						sx={{
							width: "100px",
							height: "100px",
							aspectRatio: 1,
							objectFit: "contain",
						}}
					/>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
						}}
					>
						<Typography variant='h5'>
							{user.firstName} {user.lastName}
						</Typography>
						<Typography variant='h6'>{user.login}</Typography>
						<Typography variant='h6'>{user.email}</Typography>
					</Box>
				</Box>
				<Divider
					sx={{
						border: "1px solid",
						borderColor: "accent.main",
					}}
				/>
				<Box
					sx={{
						width: "100%",
						maxWidth: {
							xs: "90vw",
							md: "100%",
						},
						marginX: "auto",
						position: "relative",
					}}
				>
					<Tabs
						value={tab}
						onChange={tabChange}
						aria-label='profile tabs'
						variant='scrollable'
						scrollButtons='auto'
						allowScrollButtonsMobile
					>
						<Tab label='Список бажань' {...a11yProps(0)} />
						<Tab label='Публікації' {...a11yProps(1)} />
						<Tab label='Коментарі до публікацій' {...a11yProps(2)} />
						<Tab label='Відгуки до товарів' {...a11yProps(3)} />
					</Tabs>
				</Box>
				<TabPanel index={0} value={tab}>
					{wishlist && wishlist.length > 0 ? (
						<ItemsList items={wishlist} />
					) : (
						<Typography variant='h5'>Список бажань порожній</Typography>
					)}
				</TabPanel>
				<TabPanel index={1} value={tab}>
					{publications && publications.length > 0 ? (
						<PublicationsList publications={publications} />
					) : (
						<Typography variant='h5'>Публікації відсутні</Typography>
					)}
				</TabPanel>
				<TabPanel index={2} value={tab}>
					{publicationsComments && publicationsComments.length > 0 ? (
						<PublicationsCommentsList comments={publicationsComments} />
					) : (
						<Typography variant='h5'>Коментарі до публікацій відсутні</Typography>
					)}
				</TabPanel>
				<TabPanel index={3} value={tab}>
					{itemsRates && itemsRates.length > 0 ? (
						<ItemsRatesList rates={itemsRates} />
					) : (
						<Typography variant='h5'>Відгуки до товарів відсутні</Typography>
					)}
				</TabPanel>
			</Box>
		</Container>
	);
}
