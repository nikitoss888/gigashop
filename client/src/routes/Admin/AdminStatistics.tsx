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
import { Item } from "../../mock/Items";
import { ItemRate } from "../../mock/ItemsRates";
import { PublicationComment } from "../../mock/PublicationsComments";
import { Wishlist } from "../../mock/Wishlists";
import { User } from "../../mock/Users";
import { Publication } from "../../mock/Publications";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "@mui/material/styles/styled";
import { Link } from "react-router-dom";
import { Genre } from "../../mock/Genres";

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
	const { users, publications, publicationsComments, items, itemsRates, wishlists, genres } = useLoaderData() as {
		users: User[];
		items: Item[];
		itemsRates: ItemRate[];
		publications: Publication[];
		publicationsComments: PublicationComment[];
		wishlists: Wishlist[];
		genres: Genre[];
	};

	// Users
	const usersCountWeek = users.filter((user) => user.createdAt.getTime() > Date.now() - 604800000).length;
	const usersCountMonth = users.filter((user) => user.createdAt.getTime() > Date.now() - 2592000000).length;
	const usersCountYear = users.filter((user) => user.createdAt.getTime() > Date.now() - 31536000000).length;
	const moderatorsCount = users.filter((user) => user.role === "moderator").length;
	const adminsCount = users.filter((user) => user.role === "admin").length;
	const blockedUsersCount = users.filter((user) => user.isBlocked).length;

	// Items
	const itemsWeek = items.filter((item) => item.createdAt.getTime() > Date.now() - 604800000);
	const itemsMonth = items.filter((item) => item.createdAt.getTime() > Date.now() - 2592000000);
	const itemsYear = items.filter((item) => item.createdAt.getTime() > Date.now() - 31536000000);
	const itemsCount = items.length;
	const itemsCountWeek = itemsWeek.length;
	const itemsCountMonth = itemsMonth.length;
	const itemsCountYear = itemsYear.length;

	const hiddenItemsCount = items.filter((item) => item.hide).length;

	const itemsRatesCount = itemsRates.length;
	const itemsRatesCountWeek = itemsRates.filter((rate) => rate.createdAt.getTime() > Date.now() - 604800000).length;
	const itemsRatesCountMonth = itemsRates.filter((rate) => rate.createdAt.getTime() > Date.now() - 2592000000).length;
	const violatingRatesCount = itemsRates.filter((rate) => rate.violation).length;

	type ItemAvgRate = { item: Item; avg_rate: number };
	const topRankedItemReducer = (acc: ItemAvgRate, item: Item) => {
		const itemRates = itemsRates.filter((rate) => rate.itemId === item.id);
		const itemAvgRate =
			Math.round((itemRates.reduce((acc, rate) => acc + rate.rate, 0) / itemRates.length) * 10) / 10;

		if (itemAvgRate > (acc.avg_rate || -1)) acc = { item, avg_rate: itemAvgRate };

		return acc;
	};
	const topRankedItem = items.reduce(topRankedItemReducer, { item: items[0], avg_rate: -1 });
	const topRankedItemCommentsCount = itemsRates.filter((rate) => rate.itemId === topRankedItem.item.id).length;

	type ItemWishlistedCount = Item & { wishlists: number };
	const mostWishlistedItemReducer = (acc: ItemWishlistedCount, item: Item) => {
		const itemWishlists = wishlists.filter((wishlist) => wishlist.itemId === item.id);
		if (itemWishlists.length > (acc.wishlists || -1)) acc = { ...item, wishlists: itemWishlists.length };
		return acc;
	};
	const mostWishlistedItem = items.reduce(mostWishlistedItemReducer, { ...items[0], wishlists: -1 });

	// Publications
	const publicationsWeek = publications.filter(
		(publication) => publication.createdAt.getTime() > Date.now() - 604800000
	);
	const publicationsMonth = publications.filter(
		(publication) => publication.createdAt.getTime() > Date.now() - 2592000000
	);
	const publicationsYear = publications.filter(
		(publication) => publication.createdAt.getTime() > Date.now() - 31536000000
	);
	const publicationsCountWeek = publicationsWeek.length;
	const publicationsCountMonth = publicationsMonth.length;
	const publicationsCountYear = publicationsYear.length;
	const authorsCount = publications.reduce((acc, publication) => {
		if (!acc.includes(publication.userId)) acc.push(publication.userId);
		return acc;
	}, [] as number[]).length;

	const publicationsCommentsCount = publicationsComments.length;
	const publicationsCommentsCountWeek = publicationsComments.filter(
		(comment) => comment.createdAt.getTime() > Date.now() - 604800000
	).length;
	const publicationsCommentsCountMonth = publicationsComments.filter(
		(comment) => comment.createdAt.getTime() > Date.now() - 2592000000
	).length;

	const violatingPublicationsCommentsCount = publicationsComments.filter((comment) => comment.violation).length;

	type PublicationRate = { publication: Publication; avg_rate: number };
	const topRankedPublicationReducer = (acc: PublicationRate, publication: Publication) => {
		const publicationRates = publicationsComments.filter((comment) => comment.publicationId === publication.id);
		const publicationAvgRate = publicationRates.reduce((acc, rate) => acc + rate.rate, 0) / publicationRates.length;

		if (publicationAvgRate > (acc.avg_rate || -1)) acc = { publication, avg_rate: publicationAvgRate };

		return acc;
	};
	const topRankedPublication = publications.reduce(topRankedPublicationReducer, {
		publication: publications[0],
		avg_rate: -1,
	});
	const topRankedPublicationCommentsCount = publicationsComments.filter(
		(comment) => comment.publicationId === topRankedPublication.publication.id
	).length;

	const violatingPublicationsCount = publications.filter((publication) => publication.violation).length;
	const hiddenPublicationsCount = publications.filter(
		(publication) => publication.hide && !publication.violation
	).length;

	// Genres
	const genresCountWeek = genres.filter((genre) => genre.createdAt.getTime() > Date.now() - 604800000).length;
	const genresCountMonth = genres.filter((genre) => genre.createdAt.getTime() > Date.now() - 2592000000).length;
	const genresCountYear = genres.filter((genre) => genre.createdAt.getTime() > Date.now() - 31536000000).length;

	// count of items in each genre
	type GenreItemsCount = { genre: Genre; count: number };
	const genresItemsCountMapper = (items: Item[]) => {
		return (genre: Genre): GenreItemsCount => {
			const genreItems = items.filter((item) => item.genresIds?.includes(genre.id));
			return { genre, count: genreItems.length };
		};
	};
	const genresItemsCount = genres.map(genresItemsCountMapper(items));
	const topGenreItemsCount = genresItemsCount.reduce((acc, genreItemsCount) => {
		if (genreItemsCount.count > acc.count) acc = genreItemsCount;
		return acc;
	}, genresItemsCount[0]);

	const hiddenGenresCount = genres.filter((genre) => genre.hide).length;

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
						<Typography variant='h6'>Зареєстровано: {users.length}</Typography>
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
						<Typography variant='h6'>Всього публікацій: {publications.length}</Typography>
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
					<Typography variant='h5'>Жанри</Typography>
				</AccordionSummary>
				<AccordionDetailsStyle>
					<Box>
						<Typography variant='h6'>Всього жанрів: {genres.length}</Typography>
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
