import { Box, IconButton, Tab, Tabs, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link, useLoaderData } from "react-router-dom";
import { Company as CompanyType } from "../../mock/Companies";
import ClientError from "../../ClientError";
import { SyntheticEvent, useState } from "react";
import { SortSwitch } from "../Items";
import { Item } from "../../mock/Items";
import { Delete, Edit } from "@mui/icons-material";
import styled from "@mui/material/styles/styled";
import List from "../../components/Admin/Items/List";

function a11yProps(index: string) {
	return {
		id: `company-tab-${index}`,
		"aria-controls": `company-tabpanel-${index}`,
	};
}

const Image = styled("img")`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

export default function AdminCompany() {
	const { company, error, developedTotalCount } = useLoaderData() as {
		company: CompanyType;
		developedTotalCount: number;
		publishedTotalCount: number;
		error?: ClientError;
	};

	if (error) throw error;

	document.title = `${company.name} — Адміністративна панель — gigashop`;

	const initSortBy = "releaseDateAsc";
	const initLimit = 12;
	const initPage = 1;

	const [sortBy, setSortBy] = useState(initSortBy);
	const [limit, setLimit] = useState(initLimit);
	const [page, setPage] = useState(initPage);

	const developedItems = company.developed || [];
	const publishedItems = company.published || [];

	const [tab, setTab] = useState<0 | 1>(0);
	const [tabItems, setTabItems] = useState(
		developedItems
			.sort((a, b) => SortSwitch(initSortBy, a, b))
			.slice((initPage - 1) * initLimit, initPage * initLimit)
	);
	const [maxPage, setMaxPage] = useState(Math.ceil((developedTotalCount || 0) / limit) || 1);

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
		setTabItems(items.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit));
		setMaxPage(Math.ceil(count / limit) || 1);
	};

	const onTabChange = (_: SyntheticEvent, newValue: 0 | 1) => {
		setTab(newValue);
		getTabItems(sortBy, limit, 1, newValue);
		setPage(1);
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
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "10px",
			}}
		>
			<Typography variant='h4' textAlign='center' mb={3}>
				Компанія №{company.id}
			</Typography>
			<Box
				sx={{
					display: "flex",
					gap: "10px",
				}}
			>
				<Tooltip title={`Редагувати компанію`}>
					<IconButton component={Link} to={`/admin/companies/${company.id}/edit`}>
						<Edit sx={{ color: "primary.main" }} />
					</IconButton>
				</Tooltip>
				<Tooltip title={`Видалити компанію`}>
					<IconButton>
						<Delete color='error' />
					</IconButton>
				</Tooltip>
			</Box>
			<Typography variant='h6'>Назва: {company.name}</Typography>
			<Box>
				<Typography variant='h6'>Опис:</Typography>
				<Typography variant='body1'>{company.description}</Typography>
			</Box>
			<Typography variant='h6'>Засновано: {company.founded.toLocaleDateString()}</Typography>
			<Typography variant='h6'>Директор: {company.director}</Typography>
			<Typography variant='h6'>Зображення</Typography>
			<Box
				sx={{
					width: "350px",
				}}
			>
				<Image src={company.image} alt={company.name} />
			</Box>
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
				<List
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
		</Box>
	);
}
