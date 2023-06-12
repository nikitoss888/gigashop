import { Box, IconButton, Tab, Tabs, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { Company, DeleteCompanyRequest } from "../../http/Companies";
import ClientError from "../../ClientError";
import { SyntheticEvent, useState } from "react";
import { SortSwitch } from "../Items";
import { DeleteItemRequest, Item } from "../../http/Items";
import { Delete, Edit } from "@mui/icons-material";
import styled from "@mui/material/styles/styled";
import List from "../../components/Admin/Items/List";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

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
	const { company, error } = useLoaderData() as {
		company: Company & { ItemsDeveloped?: Item[]; ItemsPublished?: Item[] };
		error?: ClientError;
	};

	if (error) throw error;
	const navigate = useNavigate();

	document.title = `${company.name} — Адміністративна панель — gigashop`;

	const initSortBy = "releaseDateAsc";
	const initLimit = 12;
	const initPage = 1;

	const [sortBy, setSortBy] = useState(initSortBy);
	const [limit, setLimit] = useState(initLimit);
	const [page, setPage] = useState(initPage);

	const [developedItems, setDevelopedItems] = useState(company.ItemsDeveloped || []);
	const [publishedItems, setPublishedItems] = useState(company.ItemsPublished || []);

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
		setMaxPage(Math.max(Math.ceil(count / limit) || 1));
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

	const token = Cookies.get("token");
	if (!token) throw new ClientError(403, "Ви не авторизовані");

	const onDeleteThis = async () => {
		const response = await DeleteCompanyRequest(token, company.id).catch((e: unknown) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (response instanceof ClientError) throw response;
		navigate("/admin/companies");
	};

	const onDelete = async (id: number) => {
		const result = await DeleteItemRequest(token, id).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) throw result;

		if (result) {
			setDevelopedItems(developedItems.filter((item) => item.id !== id));
			setPublishedItems(publishedItems.filter((item) => item.id !== id));
			getTabItems(sortBy, limit, page, tab);
		}
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
					<IconButton onClick={onDeleteThis}>
						<Delete color='error' />
					</IconButton>
				</Tooltip>
			</Box>
			<Typography variant='h6'>Назва: {company.name}</Typography>
			<Box>
				<Typography variant='h6'>Опис:</Typography>
				<Typography variant='body1'>{company.description}</Typography>
			</Box>
			<Typography variant='h6'>Засновано: {new Date(company.founded).toLocaleDateString()}</Typography>
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
					onDelete={onDelete}
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
