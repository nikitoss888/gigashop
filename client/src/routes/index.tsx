import { createBrowserRouter, Params, RouterProvider } from "react-router-dom";
import RootPage from "./RootPage";
// import { useRecoilState } from "recoil";
// import { userState } from "../store/User";
import Items, { SortSwitch as ItemsSortSwitch } from "./Items";
import Item from "./Item";
import Genres from "./Genres";
import Genre from "./Genre";
import ErrorPage from "./ErrorPage";
import Companies, { SortSwitch as CompaniesSortSwitch } from "./Companies";
import Company from "./Company";
import NewsList, { SortSwitch as PublicationsSortSwitch } from "./NewsList";
import NewsItem from "./NewsItem";
import Login from "./Login";
import Register from "./Register";
import AdminBase from "./Admin/AdminBase";
import AdminHome from "./Admin/AdminHome";
import AdminItems from "./Admin/AdminItems";
import AdminItem from "./Admin/AdminItem";
import AdminItemForm from "./Admin/AdminItemForm";
import NewsForm from "./NewsForm";
import AdminNews from "./Admin/AdminNews";
import AdminNewsItem from "./Admin/AdminNewsItem";
import AdminNewsForm from "./Admin/AdminNewsForm";
import AdminGenres, { SortSwitch as GenresSortSwitch } from "./Admin/AdminGenres";
import AdminGenre from "./Admin/AdminGenre";
import Cart from "./Cart";
import { default as GenresList } from "../mock/Genres";
import { calculateDiscount, default as ItemsList } from "../mock/Items";
import { default as CompaniesList } from "../mock/Companies";
import { default as PublicationsList } from "../mock/Publications";
import { default as PublicationsCommentsList } from "../mock/PublicationsComments";
import { default as ItemsRatesList } from "../mock/ItemsRates";
import Wishlists from "../mock/Wishlists";
import ClientError from "../ClientError";
import AdminGenreForm from "./Admin/AdminGenreForm";
import AdminCompanies from "./Admin/AdminCompanies";
import AdminCompanyForm from "./Admin/AdminCompanyForm";
import AdminNewsComments, { SortSwitch as PublicationsCommentsSortSwitch } from "./Admin/AdminNewsComments";
import Users from "../mock/Users";
import AdminItemsComments, { SortSwitch as ItemsRatesSortSwitch } from "./Admin/AdminItemsComments";
import AdminUsers, { SortSwitch as UsersSortSwitch } from "./Admin/AdminUsers";
import Home from "./Home";
import AdminCompany from "./Admin/AdminCompany";
import Profile from "./Profile";
import ItemCart from "../mock/ItemCart";
import AdminStatistics from "./Admin/AdminStatistics";
import CartSuccess from "./CartSuccess";

const SearchItem = (params: Params<string>, allComments?: boolean) => {
	try {
		const { id } = params;
		if (!id) return { error: new ClientError(400, "Не вказано ID товару") };

		const parsed = parseInt(id);
		if (isNaN(parsed)) return { error: new ClientError(400, "ID товару не є числом") };

		const item = ItemsList.find((item) => item.id === parsed);
		if (!item) return { error: new ClientError(404, "Товар за даним ID не знайдено") };

		let comments = ItemsRatesList.filter((comment) => comment.itemId === item.id);
		if (!allComments) comments = comments.filter((comment) => !comment.violation && !comment.hide);
		comments.forEach((comment) => {
			comment.user = Users.find((user) => user.id === comment.userId);
		});
		item.comments = comments;

		const developers = CompaniesList.filter((company) => item.developersIds?.includes(company.id));
		const publisher = CompaniesList.find((company) => company.id === item.publisherId);
		const genres = GenresList.filter((genre) => item.genresIds?.includes(genre.id));

		item.developers = developers;
		item.publisher = publisher;
		item.genres = genres;

		return { item };
	} catch (error) {
		return { error: new ClientError(500, "Помилка сервера") };
	}
};

const SearchGenre = (params: Params<string>, admin?: boolean) => {
	try {
		const { id } = params;
		if (!id) return { error: new ClientError(400, "Не вказано ID жанру") };

		const parsed = parseInt(id);
		if (isNaN(parsed)) return { error: new ClientError(400, "ID жанру не є числом") };

		const genre = GenresList.find((genre) => genre.id === parsed);
		if (!genre) return { error: new ClientError(404, "Жанр за даним ID не знайдено") };

		let items = ItemsList.filter((item) => item.genresIds?.includes(genre.id));
		if (!admin) items = items.filter((item) => !item.hide);
		const totalCount = items.length;

		genre.items = items;

		return { genre, totalCount };
	} catch (error) {
		return { error: new ClientError(500, "Помилка сервера") };
	}
};

const SearchPublication = (params: Params<string>, admin?: boolean) => {
	try {
		const { id } = params;
		if (!id) return { error: new ClientError(400, "Не вказано ID публікації") };

		const parsed = parseInt(id);
		if (isNaN(parsed)) return { error: new ClientError(400, "ID публікації не є числом") };

		const publication = PublicationsList.find((publication) => publication.id === parsed);
		if (!publication) return { error: new ClientError(404, "Публікацію за даним ID не знайдено") };

		const user = Users.find((user) => user.id === publication.userId);
		publication.user = user;

		let comments = PublicationsCommentsList.filter((comment) => comment.publicationId === parsed);
		if (!admin) comments = comments.filter((comment) => !comment.violation && !comment.hide);
		comments.forEach((comment) => {
			comment.user = Users.find((user) => user.id === comment.userId);
		});
		publication.comments = comments;

		return { publication };
	} catch (error) {
		return { error: new ClientError(500, "Помилка сервера") };
	}
};

const SearchCompany = (params: Params<string>, admin?: boolean) => {
	try {
		const { id } = params;
		if (!id) return { error: new ClientError(400, "Не вказано ID компанії") };

		const parsed = parseInt(id);
		if (isNaN(parsed)) return { error: new ClientError(400, "ID компанії не є числом") };

		const company = CompaniesList.find((company) => company.id === parsed);
		if (!company) return { error: new ClientError(404, "Компанію за даним ID не знайдено") };

		let developed = ItemsList.filter((item) => item.developersIds?.includes(company.id));
		if (!admin) developed = developed.filter((item) => !item.hide);
		const developedTotalCount = developed.length;
		company.developed = developed;

		let published = ItemsList.filter((item) => item.publisherId === company.id);
		if (!admin) published = published.filter((item) => !item.hide);
		const publishedTotalCount = published.length;
		company.published = published;

		return {
			company,
			developedTotalCount,
			publishedTotalCount,
		};
	} catch (error) {
		return { error: new ClientError(500, "Помилка сервера") };
	}
};

const SearchProfile = () => {
	const user = Users[0];

	const itemCarts = ItemCart.filter((item) => item.userId === user.id);
	const cart = ItemsList.filter((item) => itemCarts.map((itemCart) => itemCart.itemId).includes(item.id));

	const wishlists = Wishlists.filter((item) => item.userId === user.id);
	const wishlist = ItemsList.filter((item) => wishlists.map((wishlist) => wishlist.itemId).includes(item.id));

	const publications = PublicationsList.filter((publication) => publication.userId === user.id);

	const publicationsComments = PublicationsCommentsList.filter((comment) => comment.userId === user.id);

	const itemsRates = ItemsRatesList.filter((rate) => rate.userId === user.id);

	return { user, cart, wishlist, publications, publicationsComments, itemsRates };
};

type GetItemsParams = {
	admin?: boolean;
	limit?: number;
	page?: number;
	sortBy?: string;
	searchParams?: {
		name?: string;
		priceFrom?: number;
		priceTo?: number;
		dateFrom?: Date;
		dateTo?: Date;
		genres?: {
			id: number;
			name: string;
		}[];
		developers?: {
			id: number;
			name: string;
		}[];
		publisher?: {
			id: number;
			name: string;
		};
		discount?: boolean;
	};
};
export const GetItems = (params: GetItemsParams) => {
	const { admin = false, limit = 12, page = 1, sortBy = "nameAsc", searchParams = undefined } = params;
	let data = ItemsList;
	if (!admin) data = data.filter((item) => !item.hide && !item.deletedAt);
	if (searchParams) {
		data = data.filter((item) => {
			const { finalPrice } = calculateDiscount(item);
			let pass = true;
			if (searchParams.name) {
				pass = pass && item.name.toLowerCase().includes(searchParams.name.toLowerCase());
			}
			if (searchParams.priceFrom) {
				pass = pass && finalPrice >= searchParams.priceFrom;
			}
			if (searchParams.priceTo) {
				pass = pass && finalPrice <= searchParams.priceTo;
			}
			if (searchParams.dateFrom) {
				const itemReleaseDateLocal = new Date(item.releaseDate.toLocaleDateString());
				const searchParamLocal = new Date(searchParams.dateFrom.toLocaleDateString());
				pass = pass && itemReleaseDateLocal.getTime() >= searchParamLocal.getTime();
			}
			if (searchParams.dateTo) {
				const itemReleaseDateLocal = new Date(item.releaseDate.toLocaleDateString());
				const searchParamLocal = new Date(searchParams.dateTo.toLocaleDateString());
				pass = pass && itemReleaseDateLocal.getTime() <= searchParamLocal.getTime();
			}
			if (searchParams.genres && item.genresIds && searchParams.genres.length > 0) {
				const genres = searchParams.genres.map((genre) => genre.id);
				const itemGenres = item.genresIds;
				pass = pass && itemGenres.some((itemGenre) => genres.includes(itemGenre));
			}
			if (searchParams.developers && item.developersIds && searchParams.developers.length > 0) {
				const developers = searchParams.developers.map((developer) => developer.id);
				const itemDevelopers = item.developersIds;
				pass = pass && itemDevelopers.some((itemDeveloper) => developers.includes(itemDeveloper));
			}
			if (searchParams.publisher) {
				pass = pass && item.publisherId === searchParams.publisher.id;
			}
			if (searchParams.discount) {
				pass = pass && item.discount;
			}
			return pass;
		});
	}
	const totalCount = data.length;
	const { sortBy: specificSortBy, descending } = ItemsSortSwitch(sortBy);
	data = data
		.sort((a, b) => {
			if (descending) {
				switch (specificSortBy) {
					default:
					case "releaseDate":
						return b.releaseDate.getTime() - a.releaseDate.getTime();
					case "name":
						return b.name.localeCompare(a.name);
					case "price":
						return b.price - a.price;
				}
			} else {
				switch (specificSortBy) {
					default:
					case "releaseDate":
						return a.releaseDate.getTime() - b.releaseDate.getTime();
					case "name":
						return a.name.localeCompare(b.name);
					case "price":
						return a.price - b.price;
				}
			}
		})
		.slice((page - 1) * limit, (page - 1) * limit + limit);
	console.log({ data, page, limit, sortBy });

	return { data, totalCount, limit, page, sortBy };
};

type GetGenresParams = {
	admin?: boolean;
	limit?: number;
	page?: number;
	sortBy?: string;
	name?: string;
};
export const GetGenres = (params: GetGenresParams) => {
	const { admin = false, limit = 12, page = 1, sortBy = "nameAsc", name = "" } = params;
	let data = GenresList;
	if (!admin) data = data.filter((genre) => !genre.hide && !genre.deletedAt);
	if (name) data = data.filter((genre) => genre.name.toLowerCase().includes(name.toLowerCase()));
	const totalCount = data.length;
	if (admin) {
		const { descending } = GenresSortSwitch(sortBy);
		data = data
			.sort((a, b) => {
				if (descending) return b.name.localeCompare(a.name);
				else return a.name.localeCompare(b.name);
			})
			.slice((page - 1) * limit, (page - 1) * limit + limit);
	} else data = data.sort((a, b) => a.name.localeCompare(b.name));

	return { data, totalCount, limit, page, sortBy };
};

type GetCompaniesParams = {
	admin?: boolean;
	limit?: number;
	page?: number;
	sortBy?: string;
	descending?: boolean;
	name?: string;
};
export const GetCompanies = (params: GetCompaniesParams) => {
	const { admin = false, limit = 12, page = 1, sortBy = "nameAsc", name = "" } = params;
	let data = CompaniesList;
	if (!admin) data = data.filter((company) => !company.hide && !company.deletedAt);
	if (name) data = data.filter((company) => company.name.toLowerCase().includes(name.toLowerCase()));
	const totalCount = data.length;
	const { sortBy: specificSortBy, descending } = CompaniesSortSwitch(sortBy);
	data = data
		.sort((a, b) => {
			if (descending) {
				switch (specificSortBy) {
					default:
					case "founded":
						return b.founded.getTime() - a.founded.getTime();
					case "name":
						return b.name.localeCompare(a.name);
				}
			} else {
				switch (specificSortBy) {
					default:
					case "founded":
						return a.founded.getTime() - b.founded.getTime();
					case "name":
						return a.name.localeCompare(b.name);
						return 0;
				}
			}
		})
		.slice((page - 1) * limit, (page - 1) * limit + limit);

	return { data, totalCount, limit, page, sortBy };
};

type GetPublicationsParams = {
	admin?: boolean;
	limit?: number;
	page?: number;
	sortBy?: string;
	searchParams?: {
		title?: string;
		dateFrom?: Date;
		dateTo?: Date;
		tags?: string[];
		authors?: {
			id: number;
			login: string;
			firstName: string;
			lastName: string;
		}[];
	};
};
export const GetPublications = (params: GetPublicationsParams) => {
	const { admin = false, limit = 12, page = 1, sortBy = "createdAtAsc", searchParams = undefined } = params;
	let data = PublicationsList;
	if (!admin) data = data.filter((news) => !news.hide && !news.deletedAt);
	if (searchParams) {
		data = data.filter((news) => {
			let pass = true;
			if (searchParams.title) {
				pass = pass && news.title.toLowerCase().includes(searchParams.title.toLowerCase());
			}
			if (searchParams.dateFrom) {
				const newsDateLocal = new Date(news.createdAt.toLocaleDateString());
				const searchParamsDateLocal = new Date(searchParams.dateFrom.toLocaleDateString());
				pass = pass && newsDateLocal.getTime() >= searchParamsDateLocal.getTime();
			}
			if (searchParams.dateTo) {
				const newsDateLocale = new Date(news.createdAt.toLocaleDateString());
				const searchParamsDateLocale = new Date(searchParams.dateTo.toLocaleDateString());
				pass = pass && newsDateLocale.getTime() <= searchParamsDateLocale.getTime();
			}
			if (searchParams.tags && searchParams.tags.length > 0) {
				const tags = searchParams.tags;
				const itemTags = news.tags;
				if (!itemTags || itemTags.length === 0) pass = false;
				else pass = pass && itemTags.some((itemTag) => tags.includes(itemTag));
			}
			if (searchParams.authors && searchParams.authors.length > 0) {
				const authors = searchParams.authors.map((author) => author.id);
				pass = pass && authors.includes(news.userId);
			}
			return pass;
		});
	}
	const totalCount = data.length;
	const { sortBy: specificSortBy, descending } = PublicationsSortSwitch(sortBy);
	data = data
		.sort((a, b) => {
			if (descending) {
				switch (specificSortBy) {
					default:
					case "createdAt":
						return b.createdAt.getTime() - a.createdAt.getTime();
					case "title":
						return b.title.localeCompare(a.title);
				}
			} else {
				switch (specificSortBy) {
					default:
					case "createdAt":
						return a.createdAt.getTime() - b.createdAt.getTime();
					case "title":
						return a.title.localeCompare(b.title);
				}
			}
		})
		.slice((page - 1) * limit, (page - 1) * limit + limit);
	data.forEach((news) => {
		const user = Users.find((user) => user.id === news.userId);
		if (user) news.user = user;
	});

	return { data, totalCount, limit, page, sortBy };
};

type GetUsersParams = {
	limit?: number;
	page?: number;
	sortBy?: string;
};
export const GetUsers = (params: GetUsersParams) => {
	const { limit = 12, page = 1, sortBy = "createdAtAsc" } = params;
	const users = Users;
	const totalCount = users.length;

	const { sortBy: specificSortBy, descending } = UsersSortSwitch(sortBy);
	const data = users
		.sort((a, b) => {
			if (descending) {
				switch (specificSortBy) {
					default:
					case "createdAt":
						return b.createdAt.getTime() - a.createdAt.getTime();
					case "login":
						return b.login.localeCompare(a.login);
				}
			} else {
				switch (specificSortBy) {
					default:
					case "createdAt":
						return a.createdAt.getTime() - b.createdAt.getTime();
					case "login":
						return a.login.localeCompare(b.login);
				}
			}
		})
		.slice((page - 1) * limit, (page - 1) * limit + limit);

	return { data, totalCount, limit, page, sortBy };
};

type GetPublicationsCommentsParams = {
	limit?: number;
	page?: number;
	sortBy?: string;
};
export const GetPublicationsComments = (params: GetPublicationsCommentsParams) => {
	const { limit = 12, page = 1, sortBy = "createdAtAsc" } = params;
	const comments = PublicationsCommentsList;
	const totalCount = comments.length;

	const { descending } = PublicationsCommentsSortSwitch(sortBy);
	const data = comments
		.sort((a, b) => {
			if (descending) return b.createdAt.getTime() - a.createdAt.getTime();
			else return a.createdAt.getTime() - b.createdAt.getTime();
		})
		.slice((page - 1) * limit, (page - 1) * limit + limit);
	data.forEach((comment) => {
		const user = Users.find((user) => user.id === comment.userId);
		if (user) comment.user = user;
		const publication = PublicationsList.find((publication) => publication.id === comment.publicationId);
		if (publication) comment.publication = publication;
	});

	return { data, totalCount, limit, page, sortBy };
};

type GetItemsRatesParams = {
	limit?: number;
	page?: number;
	sortBy?: string;
};
export const GetItemsRates = (params: GetItemsRatesParams) => {
	const { limit = 12, page = 1, sortBy = "createdAtAsc" } = params;
	const rates = ItemsRatesList;
	const totalCount = rates.length;

	const { descending } = ItemsRatesSortSwitch(sortBy);

	const data = rates
		.sort((a, b) => {
			if (descending) return b.createdAt.getTime() - a.createdAt.getTime();
			else return a.createdAt.getTime() - b.createdAt.getTime();
		})
		.slice((page - 1) * limit, (page - 1) * limit + limit);

	data.forEach((rate) => {
		const user = Users.find((user) => user.id === rate.userId);
		if (user) rate.user = user;
		const item = ItemsList.find((item) => item.id === rate.itemId);
		if (item) rate.item = item;
	});

	return { data, totalCount, limit, page, sortBy };
};

const GetStatistics = () => {
	const data = {
		users: Users,
		items: ItemsList,
		publications: PublicationsList,
		companies: CompaniesList,
		genres: GenresList,
		itemsRates: ItemsRatesList,
		publicationsComments: PublicationsCommentsList,
		wishlists: Wishlists,
	};
	return data;
};

export default function Router() {
	// const [user, _] = useRecoilState(userState);
	const router = createBrowserRouter([
		{
			path: "",
			element: <RootPage />,
			errorElement: <ErrorPage />,
			children: [
				{
					path: "/",
					children: [
						{
							path: "/",
							element: <Home />,
						},
						{
							path: "/login",
							element: <Login />,
						},
						{
							path: "/register",
							element: <Register />,
						},
						{
							path: "/profile",
							element: <Profile />,
							loader: () => {
								console.log("profile loader");
								return SearchProfile();
							},
						},
						{
							path: "/cart",
							element: <Cart />,
							loader: () => {
								console.log("cart loader");
								return SearchProfile();
							},
						},
						{
							path: "/cart/success",
							element: <CartSuccess />,
							loader: () => {
								console.log("cart loader");
								return SearchProfile();
							},
						},
						{
							path: "/shop/items",
							element: <Items />,
							loader: () => {
								console.log("items loader");
								const { data, totalCount, limit, page, sortBy } = GetItems({});

								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
								};
							},
						},
						{
							path: "/shop/items/:id",
							element: <Item />,
							loader: ({ params }) => {
								console.log("item loader");
								return SearchItem(params);
							},
						},
						{
							path: "/shop/genres",
							element: <Genres />,
							loader: () => {
								console.log("genres loader");
								const { data } = GetGenres({});
								return { data };
							},
						},
						{
							path: "/shop/genres/:id",
							element: <Genre />,
							loader: ({ params }) => {
								console.log("genre loader");
								return SearchGenre(params);
							},
						},
						{
							path: "/shop/companies",
							element: <Companies />,
							loader: () => {
								console.log("companies loader");
								const { data, totalCount, limit, page, sortBy } = GetCompanies({});
								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
								};
							},
						},
						{
							path: "/shop/companies/:id",
							element: <Company />,
							loader: ({ params }) => {
								console.log("company loader");
								return SearchCompany(params);
							},
						},
						{
							path: "/news",
							element: <NewsList />,
							loader: () => {
								console.log("news loader");
								const { data, totalCount, limit, page, sortBy } = GetPublications({});
								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
								};
							},
						},
						{
							path: "/news/:id",
							element: <NewsItem />,
							loader: ({ params }) => {
								console.log("news item loader");
								return SearchPublication(params);
							},
						},
						{
							path: "/news/create",
							element: <NewsForm />,
							loader: () => {
								console.log("news create loader");
								return { publication: undefined };
							},
						},
						{
							path: "/news/:id/edit",
							element: <NewsForm />,
							loader: ({ params }) => {
								console.log("news edit loader");
								return SearchPublication(params);
							},
						},
					],
				},
				{
					path: "/admin",
					element: <AdminBase />,
					children: [
						{
							path: "/admin",
							element: <AdminHome />,
						},
						{
							path: "/admin/statistics",
							element: <AdminStatistics />,
							loader: () => {
								console.log("admin statistics loader");
								const data = GetStatistics();
								return data;
							},
						},
						{
							path: "/admin/users",
							element: <AdminUsers />,
							loader: () => {
								console.log("admin users loader");
								const { data, totalCount, limit, page, sortBy } = GetUsers({});
								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
								};
							},
						},
						{
							path: "/admin/items",
							element: <AdminItems />,
							loader: () => {
								console.log("admin items loader");
								const { data, totalCount, limit, page, sortBy } = GetItems({ admin: true });

								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
								};
							},
						},
						{
							path: "/admin/items/:id",
							element: <AdminItem />,
							loader: ({ params }) => {
								console.log("admin item loader");
								return SearchItem(params, true);
							},
						},
						{
							path: "/admin/items/create",
							element: <AdminItemForm />,
							loader: () => {
								return { item: undefined };
							},
						},
						{
							path: "/admin/items/:id/edit",
							element: <AdminItemForm />,
							loader: ({ params }) => {
								console.log("admin item edit loader");
								return SearchItem(params);
							},
						},
						{
							path: "/admin/genres",
							element: <AdminGenres />,
							loader: () => {
								console.log("admin genres loader");
								const { data, totalCount, sortBy, limit, page } = GetGenres({ admin: true });
								return {
									data,
									totalCount,
									initSortBy: sortBy,
									initLimit: limit,
									initPage: page,
								};
							},
						},
						{
							path: "/admin/genres/:id",
							element: <AdminGenre />,
							loader: ({ params }) => {
								console.log("admin genre loader");
								return SearchGenre(params, true);
							},
						},
						{
							path: "/admin/genres/create",
							element: <AdminGenreForm />,
							loader: () => {
								return { genre: undefined };
							},
						},
						{
							path: "/admin/genres/:id/edit",
							element: <AdminGenreForm />,
							loader: ({ params }) => {
								console.log("admin genre edit loader");
								return SearchGenre(params);
							},
						},
						{
							path: "/admin/companies",
							element: <AdminCompanies />,
							loader: () => {
								console.log("admin companies loader");
								const { data, totalCount, sortBy, limit, page } = GetCompanies({ admin: true });
								return {
									data,
									totalCount,
									initSortBy: sortBy,
									initLimit: limit,
									initPage: page,
								};
							},
						},
						{
							path: "/admin/companies/:id",
							element: <AdminCompany />,
							loader: ({ params }) => {
								console.log("admin company loader");
								return SearchCompany(params, true);
							},
						},
						{
							path: "/admin/companies/create",
							element: <AdminCompanyForm />,
							loader: () => {
								return { company: undefined };
							},
						},
						{
							path: "/admin/companies/:id/edit",
							element: <AdminCompanyForm />,
							loader: ({ params }) => {
								console.log("admin company edit loader");
								return SearchCompany(params);
							},
						},
						{
							path: "/admin/news",
							element: <AdminNews />,
							loader: () => {
								console.log("admin news loader");
								const { data, totalCount, sortBy, limit, page } = GetPublications({ admin: true });
								return {
									data,
									totalCount,
									initSortBy: sortBy,
									initLimit: limit,
									initPage: page,
								};
							},
						},
						{
							path: "/admin/news/:id",
							element: <AdminNewsItem />,
							loader: ({ params }) => {
								console.log("admin news item loader");
								return SearchPublication(params, true);
							},
						},
						{
							path: "/admin/news/create",
							element: <AdminNewsForm />,
							loader: () => {
								return { publication: undefined };
							},
						},
						{
							path: "/admin/news/:id/edit",
							element: <AdminNewsForm />,
							loader: ({ params }) => {
								console.log("admin news edit loader");
								return SearchPublication(params);
							},
						},
						{
							path: "/admin/comments/news",
							element: <AdminNewsComments />,
							loader: () => {
								console.log("admin news comments loader");
								const { data, totalCount, limit, page, sortBy } = GetPublicationsComments({});
								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
								};
							},
						},
						{
							path: "/admin/comments/items",
							element: <AdminItemsComments />,
							loader: () => {
								console.log("admin items comments loader");
								const { data, totalCount, limit, page, sortBy } = GetItemsRates({});
								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
								};
							},
						},
					],
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}
