import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Divider as MuiDivider,
	Tooltip,
	Typography,
} from "@mui/material";
import { useLoaderData } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "@mui/material/styles/styled";
import { Link } from "react-router-dom";
import { Item, ItemRate, Wishlist } from "../../http/Items";
import { User } from "../../http/User";
import { Publication, Comment } from "../../http/Publications";
import { Genre } from "../../http/Genres";
import { Company } from "../../http/Companies";

const Divider = styled(MuiDivider)`
	border: 1px solid;
	border-color: ${({ theme }) => theme.palette.primary.main};
`;

const AccordionDetailsStyle = styled(AccordionDetails)`
	display: flex;
	flex-direction: column;
	gap: 15px;
	padding: 0 15px 15px 15px;
`;

export default function AdminStatistics() {
	let { Users, Items, ItemsRates, Publications, Companies, Genres, PublicationsComments, Wishlists } =
		useLoaderData() as {
			Users?: User[];
			Items?: (Item & {
				Developers?: Company[];
				Publisher?: Company;
				Genres?: Genre[];
			})[];
			Publications?: Publication[];
			Companies?: Company[];
			Genres?: Genre[];
			ItemsRates?: ItemRate[];
			PublicationsComments?: Comment[];
			Wishlists?: Wishlist[];
		};
	Users = Users || [];
	Items = Items || [];
	Publications = Publications || [];
	Companies = Companies || [];
	Genres = Genres || [];
	ItemsRates = ItemsRates || [];
	PublicationsComments = PublicationsComments || [];
	Wishlists = Wishlists || [];

	const now = Date.now();

	// Users
	const usersCountWeek = Users.filter((user) => new Date(user.createdAt).getTime() > now - 604800000).length;
	const usersCountMonth = Users.filter((user) => new Date(user.createdAt).getTime() > now - 2592000000).length;
	const usersCountYear = Users.filter((user) => new Date(user.createdAt).getTime() > now - 31536000000).length;
	const moderatorsCount = Users.filter((user) => user.role === "moderator").length;
	const adminsCount = Users.filter((user) => user.role === "admin").length;
	const blockedUsersCount = Users.filter((user) => user.isBlocked).length;

	// Items
	const itemsWeek = Items.filter((item) => new Date(item.createdAt).getTime() > now - 604800000);
	const itemsMonth = Items.filter((item) => new Date(item.createdAt).getTime() > now - 2592000000);
	const itemsYear = Items.filter((item) => new Date(item.createdAt).getTime() > now - 31536000000);
	const itemsCount = Items.length;
	const itemsCountWeek = itemsWeek.length;
	const itemsCountMonth = itemsMonth.length;
	const itemsCountYear = itemsYear.length;

	const hiddenItemsCount = Items.filter((item) => item.hide).length;

	const itemsRatesCount = ItemsRates.length;
	const itemsRatesCountWeek = ItemsRates.filter(
		(rate) => new Date(rate.createdAt).getTime() > now - 604800000
	).length;
	const itemsRatesCountMonth = ItemsRates.filter(
		(rate) => new Date(rate.createdAt).getTime() > now - 2592000000
	).length;
	const violatingRatesCount = ItemsRates.filter((rate) => rate.violation).length;

	const calcItemAvgRate = (item?: Item) => {
		if (!item) return -1;
		const itemRates = ItemsRates ? ItemsRates.filter((rate) => rate.itemId === item.id) : [];
		let itemAvgRate =
			Math.round((itemRates.reduce((acc, rate) => acc + rate.rate, 0) / itemRates.length) * 10) / 10;
		itemAvgRate = isNaN(itemAvgRate) ? 0 : itemAvgRate;
		return itemAvgRate;
	};
	const topRankedItemReducer = (acc: { item: Item; avg_rate: number }, item: Item) => {
		const itemAvgRate = calcItemAvgRate(item);
		if (itemAvgRate > (acc.avg_rate || -1)) acc = { item, avg_rate: itemAvgRate };

		return acc;
	};

	const firstItem = Items.length > 0 ? Items[0] : undefined;
	const firstItemAvgRate = calcItemAvgRate(firstItem);

	const topItem = firstItem
		? Items.reduce(topRankedItemReducer, { item: firstItem, avg_rate: firstItemAvgRate })
		: undefined;
	const topItemRatesCount = topItem ? ItemsRates.filter((rate) => rate.itemId === topItem.item.id).length : undefined;

	type ItemWishlistedCount = Item & { wishlists: number };
	const calcItemWishlists = (item?: Item) => {
		if (!item) return -1;
		return (Wishlists ? Wishlists.filter((wishlist) => wishlist.itemId === item.id) : []).length;
	};
	const mostWishlistedItemReducer = (acc: ItemWishlistedCount, item: Item) => {
		const itemWishlists = Wishlists ? Wishlists.filter((wishlist) => wishlist.itemId === item.id) : [];
		if (itemWishlists.length > acc.wishlists) acc = { ...item, wishlists: itemWishlists.length };
		return acc;
	};

	const firstItemWishlistsCount = calcItemWishlists(firstItem);

	const mostWishlistedItem =
		Items.length > 0
			? Items.reduce(mostWishlistedItemReducer, { ...Items[0], wishlists: firstItemWishlistsCount })
			: undefined;

	// Publications
	const publicationsWeek = Publications.filter(
		(publication) => new Date(publication.createdAt).getTime() > now - 604800000
	);
	const publicationsMonth = Publications.filter(
		(publication) => new Date(publication.createdAt).getTime() > now - 2592000000
	);
	const publicationsYear = Publications.filter(
		(publication) => new Date(publication.createdAt).getTime() > now - 31536000000
	);
	const publicationsCountWeek = publicationsWeek.length;
	const publicationsCountMonth = publicationsMonth.length;
	const publicationsCountYear = publicationsYear.length;
	const authorsCount = Publications.reduce((acc, publication) => {
		if (!acc.includes(publication.userId)) acc.push(publication.userId);
		return acc;
	}, [] as number[]).length;

	const publicationsCommentsCount = PublicationsComments.length;
	const publicationsCommentsCountWeek = PublicationsComments.filter(
		(comment) => new Date(comment.createdAt).getTime() > now - 604800000
	).length;
	const publicationsCommentsCountMonth = PublicationsComments.filter(
		(comment) => new Date(comment.createdAt).getTime() > now - 2592000000
	).length;

	const violatingPublicationsCommentsCount = PublicationsComments.filter((comment) => comment.violation).length;

	const calcPublicationAvgRate = (publication?: Publication) => {
		if (!publication) return -1;
		const publicationRates = PublicationsComments
			? PublicationsComments.filter((comment) => comment.publicationId === publication.id)
			: [];
		let publicationAvgRate = publicationRates.reduce((acc, rate) => acc + rate.rate, 0) / publicationRates.length;
		publicationAvgRate = isNaN(publicationAvgRate) ? 0 : publicationAvgRate;
		return publicationAvgRate;
	};
	const topRankedPublicationReducer = (
		acc: { publication: Publication; avg_rate: number },
		publication: Publication
	) => {
		const publicationAvgRate = calcPublicationAvgRate(publication);
		if (publicationAvgRate > (acc.avg_rate || -1)) acc = { publication, avg_rate: publicationAvgRate };

		return acc;
	};
	const topPublication =
		Publications.length > 0
			? Publications.reduce(topRankedPublicationReducer, { publication: Publications[0], avg_rate: -1 })
			: undefined;
	const topRankedPublicationCommentsCount =
		topPublication && PublicationsComments.length > 0
			? PublicationsComments.filter((comment) => comment.publicationId === topPublication.publication.id).length
			: undefined;

	const violatingPublicationsCount = Publications.filter((publication) => publication.violation).length;
	const hiddenPublicationsCount = Publications.filter(
		(publication) => publication.hide && !publication.violation
	).length;

	// Companies

	const companiesCountWeek = Companies.filter(
		(company) => new Date(company.createdAt).getTime() > now - 604800000
	).length;
	const companiesCountMonth = Companies.filter(
		(company) => new Date(company.createdAt).getTime() > now - 2592000000
	).length;
	const companiesCountYear = Companies.filter(
		(company) => new Date(company.createdAt).getTime() > now - 31536000000
	).length;
	const hiddenCompaniesCount = Companies.filter((company) => company.hide).length;

	type CompanyItemsCount = { company: Company; count: number };

	const companiesDevelopedItemsCount = Companies.map((company): CompanyItemsCount => {
		const developedItems = Items
			? Items.filter((item) => (item.Developers ? item.Developers.includes(company) : false))
			: [];
		return { company, count: developedItems.length };
	});
	const topDeveloper =
		companiesDevelopedItemsCount.length > 0
			? companiesDevelopedItemsCount.reduce((acc, company) => {
					if (company.count > (acc.count || -1)) acc = company;
					return acc;
			  })
			: undefined;

	const companiesPublishedItemsCount = Companies.map((company): CompanyItemsCount => {
		const publishedItems = Items ? Items.filter((item) => item.company_publisherId === company.id) : [];
		return { company, count: publishedItems.length };
	});
	const topPublisher =
		companiesPublishedItemsCount.length > 0
			? companiesPublishedItemsCount.reduce((acc, company) => {
					if (company.count > (acc.count || -1)) acc = company;
					return acc;
			  })
			: undefined;
	// Genres
	const genresCountWeek = Genres.filter((genre) => new Date(genre.createdAt).getTime() > now - 604800000).length;
	const genresCountMonth = Genres.filter((genre) => new Date(genre.createdAt).getTime() > now - 2592000000).length;
	const genresCountYear = Genres.filter((genre) => new Date(genre.createdAt).getTime() > now - 31536000000).length;

	type GenreItemsCount = { genre: Genre; count: number };
	const genresItemsCountMapper = (items: typeof Items) => {
		return (genre: Genre): GenreItemsCount => {
			const genreItems = items?.filter((item) => item.Genres?.includes(genre)) || [];
			return { genre, count: genreItems.length };
		};
	};
	const genresItemsCount = Genres.map(genresItemsCountMapper(Items));
	const topGenre =
		genresItemsCount.length > 0
			? genresItemsCount.reduce((acc, genreItemsCount) => {
					if (genreItemsCount.count > acc.count) acc = genreItemsCount;
					return acc;
			  })
			: undefined;

	const hiddenGenresCount = Genres.filter((genre) => genre.hide).length;

	return (
		<Box>
			<Typography variant='h4' textAlign='center' mb={3}>
				Статистика даних вебсайту
			</Typography>
			<Accordion disableGutters>
				<AccordionSummary expandIcon={<ExpandMoreIcon color='primary' fontSize='large' />}>
					<Typography variant='h5'>Користувачі</Typography>
				</AccordionSummary>
				<AccordionDetailsStyle>
					<Box>
						<Typography variant='h6'>Зареєстровано: {Users.length}</Typography>
						<Typography variant='h6'>За цей тиждень: {usersCountWeek}</Typography>
						<Typography variant='h6'>За цей місяць: {usersCountMonth}</Typography>
						<Typography variant='h6'>За цей рік: {usersCountYear}</Typography>
						<Typography variant='h6'>Всього заблокованих: {blockedUsersCount}</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography variant='h6'>Всього модераторів: {moderatorsCount}</Typography>
						<Typography variant='h6'>Всього адміністраторів: {adminsCount}</Typography>
					</Box>
				</AccordionDetailsStyle>
			</Accordion>
			<Accordion disableGutters>
				<AccordionSummary expandIcon={<ExpandMoreIcon color='primary' fontSize='large' />}>
					<Typography variant='h5'>Товари</Typography>
				</AccordionSummary>
				<AccordionDetailsStyle>
					<Box>
						<Typography variant='h6'>Всього товарів: {itemsCount}</Typography>
						<Typography variant='h6'>За цей тиждень: {itemsCountWeek}</Typography>
						<Typography variant='h6'>За цей місяць: {itemsCountMonth}</Typography>
						<Typography variant='h6'>За цей рік: {itemsCountYear}</Typography>
						<Typography variant='h6'>Всього прихованих: {hiddenItemsCount}</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography variant='h6'>Всього оцінок: {itemsRatesCount}</Typography>
						<Typography variant='h6'>За цей тиждень: {itemsRatesCountWeek}</Typography>
						<Typography variant='h6'>За цей місяць: {itemsRatesCountMonth}</Typography>
						<Typography variant='h6'>Всього з порушеннями: {violatingRatesCount}</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography
							variant='h6'
							{...(topItem && {
								component: Link,
								to: `/admin/items/${topItem.item.id}`,
								sx: {
									"&:hover": {
										textDecoration: "underline",
									},
								},
							})}
						>
							Найкращий товар: {topItem ? topItem.item.name : "—"}
						</Typography>
						<Typography variant='h6'>Рейтинг: {topItem ? topItem.avg_rate : "—"}</Typography>
						<Typography variant='h6'>
							Кількість оцінок: {topItemRatesCount ? topItemRatesCount : "—"}
						</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography variant='h6'>
							Найбільш бажаний товар: {mostWishlistedItem ? mostWishlistedItem.name : "—"}
						</Typography>
						<Typography variant='h6'>
							Кількість бажань: {mostWishlistedItem ? mostWishlistedItem.wishlists : "—"}
						</Typography>
					</Box>
				</AccordionDetailsStyle>
			</Accordion>
			<Accordion disableGutters>
				<AccordionSummary expandIcon={<ExpandMoreIcon color='primary' fontSize='large' />}>
					<Typography variant='h5'>Публікації</Typography>
				</AccordionSummary>
				<AccordionDetailsStyle>
					<Box>
						<Typography variant='h6'>Всього публікацій: {Publications.length}</Typography>
						<Typography variant='h6'>За цей тиждень: {publicationsCountWeek}</Typography>
						<Typography variant='h6'>За цей місяць: {publicationsCountMonth}</Typography>
						<Typography variant='h6'>За цей рік: {publicationsCountYear}</Typography>
						<Tooltip title='Не включаються публікації, які порушують правила'>
							<Typography variant='h6'>Всього прихованих: {hiddenPublicationsCount}</Typography>
						</Tooltip>
						<Typography variant='h6'>Всього з порушеннями: {violatingPublicationsCount}</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography variant='h6'>Всього авторів: {authorsCount}</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography variant='h6'>Всього коментарів: {publicationsCommentsCount}</Typography>
						<Typography variant='h6'>За цей тиждень: {publicationsCommentsCountWeek}</Typography>
						<Typography variant='h6'>За цей місяць: {publicationsCommentsCountMonth}</Typography>
						<Typography variant='h6'>Всього з порушеннями: {violatingPublicationsCommentsCount}</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography
							variant='h6'
							{...(topPublication && {
								component: Link,
								to: `/admin/news/${topPublication.publication.id}`,
								sx: {
									"&:hover": {
										textDecoration: "underline",
									},
								},
							})}
						>
							Найкраща публікація за весь час: {topPublication ? topPublication.publication.title : "—"}
						</Typography>
						<Typography variant='h6'>
							Загальна оцінка: {topPublication ? topPublication.avg_rate : "—"}
						</Typography>
						<Typography variant='h6'>Кількість коментарів: {topRankedPublicationCommentsCount}</Typography>
					</Box>
				</AccordionDetailsStyle>
			</Accordion>
			<Accordion disableGutters>
				<AccordionSummary expandIcon={<ExpandMoreIcon color='primary' fontSize='large' />}>
					<Typography variant='h5'>Компанії</Typography>
				</AccordionSummary>
				<AccordionDetailsStyle>
					<Box>
						<Typography variant='h6'>Всього компаній: {Companies.length}</Typography>
						<Typography variant='h6'>За цей тиждень: {companiesCountWeek}</Typography>
						<Typography variant='h6'>За цей місяць: {companiesCountMonth}</Typography>
						<Typography variant='h6'>За цей рік: {companiesCountYear}</Typography>
						<Typography variant='h6'>Всього прихованих: {hiddenCompaniesCount}</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography
							variant='h6'
							{...(topDeveloper && {
								component: Link,
								to: `/admin/companies/${topDeveloper.company.id}`,
								sx: {
									"&:hover": {
										textDecoration: "underline",
									},
								},
							})}
						>
							Найбільший розробник: {topDeveloper ? topDeveloper.company.name : "—"}
						</Typography>
						<Typography variant='h6'>
							Кількість товарів: {topDeveloper ? topDeveloper.count : "—"}
						</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography
							variant='h6'
							{...(topPublisher && {
								component: Link,
								to: `/admin/companies/${topPublisher.company.id}`,
								sx: {
									"&:hover": {
										textDecoration: "underline",
									},
								},
							})}
						>
							Найбільший видавець: {topPublisher ? topPublisher.company.name : "—"}
						</Typography>
						<Typography variant='h6'>
							Кількість товарів: {topPublisher ? topPublisher.count : "—"}
						</Typography>
					</Box>
				</AccordionDetailsStyle>
			</Accordion>
			<Accordion disableGutters>
				<AccordionSummary expandIcon={<ExpandMoreIcon color='primary' fontSize='large' />}>
					<Typography variant='h5'>Жанри</Typography>
				</AccordionSummary>
				<AccordionDetailsStyle>
					<Box>
						<Typography variant='h6'>Всього жанрів: {Genres.length}</Typography>
						<Typography variant='h6'>За цей тиждень: {genresCountWeek}</Typography>
						<Typography variant='h6'>За цей місяць: {genresCountMonth}</Typography>
						<Typography variant='h6'>За цей рік: {genresCountYear}</Typography>
						<Typography variant='h6'>Всього прихованих: {hiddenGenresCount}</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography
							variant='h6'
							{...(topGenre && {
								component: Link,
								to: `/admin/genres/${topGenre.genre.id}`,
								sx: {
									"&:hover": {
										textDecoration: "underline",
									},
								},
							})}
						>
							Найбільший жанр: {topGenre ? topGenre.genre.name : "—"}
						</Typography>
						<Typography variant='h6'>Кількість товарів: {topGenre ? topGenre.count : "—"}</Typography>
					</Box>
				</AccordionDetailsStyle>
			</Accordion>
		</Box>
	);
}
