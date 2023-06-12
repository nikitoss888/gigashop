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

const TypographyLink = styled(Typography)`
	text-decoration: none;
	&:hover {
		text-decoration: underline;
	}
` as typeof Typography;

export default function AdminStatistics() {
	let { Users, Items, ItemsRates, Publications, Companies, Genres, PublicationsComments, Wishlists } =
		useLoaderData() as {
			Users?: User[];
			Items?: (Item & {
				Developers: Company[];
				Publisher: Company;
				Genres: Genre[];
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

	type ItemAvgRate = { item: Item; avg_rate: number };
	const topRankedItemReducer = (acc: ItemAvgRate, item: Item) => {
		const itemRates = ItemsRates?.filter((rate) => rate.itemId === item.id) || [];
		const itemAvgRate =
			Math.round((itemRates.reduce((acc, rate) => acc + rate.rate, 0) / itemRates.length) * 10) / 10;

		if (itemAvgRate > (acc.avg_rate || -1)) acc = { item, avg_rate: itemAvgRate };

		return acc;
	};
	const topRankedItem = Items.reduce(topRankedItemReducer, {} as ItemAvgRate);
	const topRankedItemCommentsCount = ItemsRates.filter((rate) => rate.itemId === topRankedItem.item.id).length;

	type ItemWishlistedCount = Item & { wishlists: number };
	const mostWishlistedItemReducer = (acc: ItemWishlistedCount, item: Item) => {
		const itemWishlists = Wishlists?.filter((wishlist) => wishlist.itemId === item.id) || [];
		if (itemWishlists.length > acc.wishlists) acc = { ...item, wishlists: itemWishlists.length };
		return acc;
	};
	const mostWishlistedItem = Items.reduce(mostWishlistedItemReducer, {} as ItemWishlistedCount);

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

	type PublicationRate = { publication: Publication; avg_rate: number };
	const topRankedPublicationReducer = (acc: PublicationRate, publication: Publication) => {
		const publicationRates =
			PublicationsComments?.filter((comment) => comment.publicationId === publication.id) || [];
		const publicationAvgRate = publicationRates.reduce((acc, rate) => acc + rate.rate, 0) / publicationRates.length;

		if (publicationAvgRate > (acc.avg_rate || -1)) acc = { publication, avg_rate: publicationAvgRate };

		return acc;
	};
	const topRankedPublication = Publications.reduce(topRankedPublicationReducer, {} as PublicationRate);
	const topRankedPublicationCommentsCount = PublicationsComments.filter(
		(comment) => comment.publicationId === topRankedPublication.publication.id
	).length;

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
		const developedItems = Items?.filter((item) => item.Developers.includes(company)) || [];
		return { company, count: developedItems.length };
	});
	const topDeveloper = companiesDevelopedItemsCount.reduce((acc, company) => {
		if (company.count > (acc.count || -1)) acc = company;
		return acc;
	}, {} as CompanyItemsCount);

	const companiesPublishedItemsCount = Companies.map((company): CompanyItemsCount => {
		const publishedItems = Items?.filter((item) => item.company_publisherId === company.id) || [];
		return { company, count: publishedItems.length };
	});
	const topPublisher = companiesPublishedItemsCount.reduce((acc, company) => {
		if (company.count > (acc.count || -1)) acc = company;
		return acc;
	});
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
	const topGenreItemsCount = genresItemsCount.reduce((acc, genreItemsCount) => {
		if (genreItemsCount.count > acc.count) acc = genreItemsCount;
		return acc;
	}, genresItemsCount[0]);

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
						<TypographyLink variant='h6' component={Link} to={`/admin/items/${topRankedItem.item.id}`}>
							Найкращий товар: {topRankedItem.item.name}
						</TypographyLink>
						<Typography variant='h6'>Рейтинг: {topRankedItem.avg_rate}</Typography>
						<Typography variant='h6'>Кількість оцінок: {topRankedItemCommentsCount}</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography variant='h6'>Найбільш бажаний товар: {mostWishlistedItem.name}</Typography>
						<Typography variant='h6'>Кількість бажань: {mostWishlistedItem.wishlists}</Typography>
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
						<TypographyLink
							variant='h6'
							component={Link}
							to={`/admin/publications/${topRankedPublication.publication.id}`}
						>
							Найкраща публікація за весь час: {topRankedPublication.publication.title}
						</TypographyLink>
						<Typography variant='h6'>Загальна оцінка: {topRankedPublication.avg_rate}</Typography>
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
						<Typography variant='h6'>Найбільший розробник: {topDeveloper.company.name}</Typography>
						<Typography variant='h6'>Кількість товарів: {topDeveloper.count}</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography variant='h6'>Найбільший видавець: {topPublisher.company.name}</Typography>
						<Typography variant='h6'>Кількість товарів: {topPublisher.count}</Typography>
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
						<Typography variant='h6'>Найбільший жанр: {topGenreItemsCount.genre.name}</Typography>
						<Typography variant='h6'>Кількість товарів: {topGenreItemsCount.count}</Typography>
					</Box>
				</AccordionDetailsStyle>
			</Accordion>
		</Box>
	);
}
