import { useParams } from "react-router-dom";
import Companies from "../mock/Companies";
import Items, { Item } from "../mock/Items";
import { Box, Container, Tab, Tabs } from "@mui/material";
import Typography from "@mui/material/Typography";
import LogoImage from "../components/Company/LogoImage";
import Grid from "../components/Company/Grid";
import DataGroup from "../components/DataGroup";
import { SyntheticEvent, useState } from "react";
import ItemsGrid from "../components/Items/ItemsGrid";

function a11yProps(index: string) {
	return {
		id: `company-tab-${index}`,
		"aria-controls": `company-tabpanel-${index}`,
	};
}

export default function Company() {
	const { id } = useParams();
	const company = Companies.find((company) => company.id.toString() === id);

	if (!company) {
		const error = new Error("Компанію за даним ID не знайдено");
		error.name = "404";
		throw error;
	}
	document.title = `gigashop — ${company.name}`;
	const developedItems = Items.filter((item) => company.developed?.includes(item.id));
	const publishedItems = Items.filter((item) => company.published?.includes(item.id));

	const [tab, setTab] = useState<0 | 1>(0);
	const [tabItems, setTabItems] = useState<Item[]>(developedItems);

	const onTabChange = (_: SyntheticEvent, newValue: 0 | 1) => {
		console.log(newValue);
		setTab(newValue);
		setTabItems(newValue === 0 ? developedItems : publishedItems);
	};

	return (
		<Container sx={{ marginTop: "15px", height: "100%" }}>
			<Grid
				sx={{
					gridTemplateColumns: {
						xs: "1fr",
						sm: "1fr 5fr",
					},
				}}
			>
				<Typography
					component='h2'
					variant='h3'
					my={3}
					textAlign='center'
					sx={{ gridColumn: { xs: "1 / 2", sm: "1 / 3" } }}
				>
					{company.name}
				</Typography>
				<Box
					sx={{
						gridColumn: "1 / 2",
						gridRow: "2 / 4",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<LogoImage src={company.image} alt={company.name} />
				</Box>
				<DataGroup title='Дата заснування' column='2 / 3'>
					<Typography variant='body1'>{company.founded?.toLocaleDateString() || "Не вказано"}</Typography>
				</DataGroup>
				<DataGroup title='Директор' column='2 / 3'>
					<Typography variant='body1'>{company.director || "Не вказано"}</Typography>
				</DataGroup>
				<DataGroup title='Опис' column='1 / 3'>
					<Typography variant='body1'>{company.description || "Не вказано"}</Typography>
				</DataGroup>
			</Grid>
			<Box>
				<Tabs value={tab} onChange={onTabChange} aria-label='items-tabs'>
					<Tab
						label={<Typography variant='body1'>Розроблено ({developedItems.length})</Typography>}
						{...a11yProps("developed")}
						sx={{
							padding: 0,
							paddingRight: "15px",
							textTransform: "none",
						}}
					/>
					<Tab
						label={<Typography variant='body1'>Опубліковано ({publishedItems.length})</Typography>}
						{...a11yProps("published")}
						sx={{
							padding: 0,
							paddingRight: "15px",
							textTransform: "none",
						}}
					/>
				</Tabs>
				<ItemsGrid items={tabItems} />
			</Box>
		</Container>
	);
}
