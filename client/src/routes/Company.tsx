import { useParams } from "react-router-dom";
import Companies from "../mock/Companies";
import Items, { Item } from "../mock/Items";
import { Box, Container, Tab, Tabs } from "@mui/material";
import Typography from "@mui/material/Typography";
import LogoImage from "../components/Company/LogoImage";
import Grid from "../components/Company/Grid";
import DataGroup from "../components/Common/DataGroup";
import { SyntheticEvent, useEffect, useState } from "react";
import ItemsGrid from "../components/Items/ItemsGrid";
import HTTPError from "../HTTPError";

function a11yProps(index: string) {
	return {
		id: `company-tab-${index}`,
		"aria-controls": `company-tabpanel-${index}`,
	};
}

export default function Company() {
	const { id } = useParams();
	if (!id) throw new HTTPError(400, "Не вказано ID компанії");

	const parsed = parseInt(id);
	if (isNaN(parsed)) throw new HTTPError(400, "ID компанії не є числом");

	const company = Companies.find((company) => company.id === parsed);
	if (!company) throw new HTTPError(404, "Компанію за даним ID не знайдено");

	const [sortBy, setSortBy] = useState("releaseDate");
	const [limit, setLimit] = useState(12);
	const [page, setPage] = useState(1);

	document.title = `${company.name} — gigashop`;

	const developedItems = Items.filter((item) => company.developed?.includes(item.id));
	const publishedItems = Items.filter((item) => company.published?.includes(item.id));

	const [tab, setTab] = useState<0 | 1>(0);
	const [tabItems, setTabItems] = useState(
		developedItems
			.sort((a, b) => {
				switch (sortBy) {
					case "releaseDate":
						return a.releaseDate.getTime() - b.releaseDate.getTime();
					case "name":
					default:
						return a.name.localeCompare(b.name);
				}
			})
			.slice((page - 1) * limit, page * limit)
	);
	const [maxPage, setMaxPage] = useState(Math.ceil(developedItems.length / limit) || 1);

	const getTabItems = (refresh?: boolean, localTab?: number) => {
		const localPage = refresh ? 1 : page;
		let items: Item[];
		if (localTab) {
			items = localTab === 0 ? developedItems : publishedItems;
		} else {
			items = tab === 0 ? developedItems : publishedItems;
		}

		const sorted = items
			.sort((a, b) => {
				switch (sortBy) {
					case "releaseDate":
						return a.releaseDate.getTime() - b.releaseDate.getTime();
					case "name":
					default:
						return a.name.localeCompare(b.name);
				}
			})
			.slice((localPage - 1) * limit, localPage * limit);
		setTabItems(sorted);
		refresh && setMaxPage(Math.ceil(items.length / limit) || 1);
	};

	const onTabChange = (_: SyntheticEvent, newValue: 0 | 1) => {
		setTab(newValue);
		getTabItems(true, newValue);
		setPage(1);
	};

	useEffect(() => {
		setPage(1);
		getTabItems(true);
	}, [sortBy, limit]);

	useEffect(() => {
		getTabItems();
	}, [page]);

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
				<Tabs
					value={tab}
					onChange={onTabChange}
					aria-label='items-tabs'
					sx={{
						marginBottom: "15px",
					}}
				>
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
				<ItemsGrid
					items={tabItems}
					sorting={{
						value: sortBy,
						setValue: setSortBy,
					}}
					limitation={{
						value: limit,
						setValue: setLimit,
					}}
					pagination={{
						value: page,
						setValue: setPage,
						maxValue: maxPage,
					}}
				/>
			</Box>
		</Container>
	);
}
