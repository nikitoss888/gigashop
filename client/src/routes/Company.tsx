import { useLoaderData } from "react-router-dom";
import { Company as CompanyType } from "../http/Companies";
import { Item } from "../http/Items";
import { Box, Container, Tab, Tabs } from "@mui/material";
import Typography from "@mui/material/Typography";
import LogoImage from "../components/Company/LogoImage";
import Grid from "../components/Company/Grid";
import DataGroup from "../components/Common/DataGroup";
import { SyntheticEvent, useState } from "react";
import ItemsGrid from "../components/Items/ItemsGrid";
import ClientError from "../ClientError";
import { SortSwitch } from "./Items";

function a11yProps(index: string) {
	return {
		id: `company-tab-${index}`,
		"aria-controls": `company-tabpanel-${index}`,
	};
}

export default function Company() {
	const { company, error } = useLoaderData() as {
		company: CompanyType & {
			ItemsDeveloped?: Item[];
			ItemsPublished?: Item[];
		};
		error?: ClientError;
	};

	if (error) throw error;

	document.title = `${company.name} — gigashop`;

	const initSortBy = "releaseDateAsc";
	const initLimit = 12;
	const initPage = 1;

	const [sortBy, setSortBy] = useState(initSortBy);
	const [limit, setLimit] = useState(initLimit);
	const [page, setPage] = useState(initPage);

	const developedItems = company.ItemsDeveloped || [];
	const publishedItems = company.ItemsPublished || [];

	const [tab, setTab] = useState<0 | 1>(0);
	const { sortBy: specificSortBy, descending } = SortSwitch(sortBy);
	const [tabItems, setTabItems] = useState(
		developedItems
			.sort((a, b) => {
				if (descending) {
					switch (specificSortBy) {
						default:
						case "releaseDate":
							return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
						case "name":
							return b.name.localeCompare(a.name);
						case "price":
							return b.price - a.price;
					}
				} else {
					switch (specificSortBy) {
						default:
						case "releaseDate":
							return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
						case "name":
							return a.name.localeCompare(b.name);
						case "price":
							return a.price - b.price;
					}
				}
			})
			.slice((initPage - 1) * initLimit, initPage * initLimit)
	);
	const [maxPage, setMaxPage] = useState(Math.ceil((developedItems.length || 0) / limit) || 1);

	const getTabItems = (sortBy: string, limit: number, page: number, tab: number) => {
		let items: Item[] = [];
		switch (tab) {
			case 1:
				items = publishedItems;
				break;
			default:
			case 0:
				items = developedItems;
				break;
		}

		const count = items.length;
		const { sortBy: specificSortBy, descending } = SortSwitch(sortBy);
		setTabItems(
			items
				.sort((a, b) => {
					if (descending) {
						switch (specificSortBy) {
							default:
							case "releaseDate":
								return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
							case "name":
								return b.name.localeCompare(a.name);
							case "price":
								return b.price - a.price;
						}
					} else {
						switch (specificSortBy) {
							default:
							case "releaseDate":
								return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
							case "name":
								return a.name.localeCompare(b.name);
							case "price":
								return a.price - b.price;
						}
					}
				})
				.slice((page - 1) * limit, page * limit)
		);
		setMaxPage(Math.ceil(count / limit) || 1);
	};

	const onTabChange = (_: SyntheticEvent, newValue: 0 | 1) => {
		setTab(newValue);
		setPage(1);
		getTabItems(sortBy, limit, 1, newValue);
	};

	const sortByUpdate = (sortBy: string) => {
		getTabItems(sortBy, limit, page, tab);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getTabItems(sortBy, limit, page, tab);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getTabItems(sortBy, limit, localPage, tab);
		setPage(localPage);
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
					<Typography variant='body1'>
						{new Date(company.founded).toLocaleDateString() || "Не вказано"}
					</Typography>
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
						setValue: sortByUpdate,
					}}
					limitation={{
						value: limit,
						setValue: limitUpdate,
					}}
					pagination={{
						value: page,
						setValue: pageUpdate,
						maxValue: maxPage,
					}}
				/>
			</Box>
		</Container>
	);
}
