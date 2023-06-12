import { createBrowserRouter, Params, RouterProvider } from "react-router-dom";
import RootPage from "./RootPage";
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
import AdminGenres, { SortSwitch as GenresSortSwitch } from "./Admin/AdminGenres";
import AdminGenre from "./Admin/AdminGenre";
import Cart from "./Cart";
import ClientError from "../ClientError";
import AdminGenreForm from "./Admin/AdminGenreForm";
import AdminCompanies from "./Admin/AdminCompanies";
import AdminCompanyForm from "./Admin/AdminCompanyForm";
import AdminNewsComments, { SortSwitch as PublicationsCommentsSortSwitch } from "./Admin/AdminNewsComments";
import AdminItemsComments, { SortSwitch as ItemsRatesSortSwitch } from "./Admin/AdminItemsRates";
import AdminUsers, { SortSwitch as UsersSortSwitch } from "./Admin/AdminUsers";
import Home from "./Home";
import AdminCompany from "./Admin/AdminCompany";
import Profile from "./Profile";
import AdminStatistics from "./Admin/AdminStatistics";
import CartSuccess from "./CartSuccess";
import { GetAllUsersRequest, ProfileRequest, SetUpCartRequest } from "../http/User";
import Cookies from "js-cookie";
import { calculateDiscount, GetAllItemsParams, GetAllItemsRequest, GetItemRequest } from "../http/Items";
import { AxiosError } from "axios";
import { GetAllGenresRequest, GetGenreRequest } from "../http/Genres";
import { GetAllPublicationsRequest, GetPublicationRequest } from "../http/Publications";
import { GetAllCompaniesRequest, GetCompanyRequest } from "../http/Companies";
import { GetAllItemsRatesRequest, GetAllPublicationsCommentsRequest } from "../http/Comments";
import { GetStatisticsDataRequest } from "../http/Moderation";

const SearchItem = async (params: Params<string>, admin?: boolean) => {
	try {
		const { id } = params;
		if (!id) return { error: new ClientError(400, "Не вказано ID товару") };

		const parsed = parseInt(id);
		if (isNaN(parsed)) return { error: new ClientError(400, "ID товару не є числом") };

		const item = await GetItemRequest(parsed, admin).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (item instanceof ClientError) return { error: item };

		return { item };
	} catch (error) {
		return { error: new ClientError(500, "Помилка сервера") };
	}
};

const SearchGenre = async (params: Params<string>, admin?: boolean) => {
	try {
		const { id } = params;
		if (!id) return { error: new ClientError(400, "Не вказано ID жанру") };

		const parsed = parseInt(id);
		if (isNaN(parsed)) return { error: new ClientError(400, "ID жанру не є числом") };

		const result = await GetGenreRequest(parsed, admin).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) return { error: result };

		const genre = result;

		return { genre };
	} catch (error) {
		return { error: new ClientError(500, "Помилка сервера") };
	}
};

const SearchPublication = async (params: Params<string>, admin?: boolean) => {
	try {
		const { id } = params;
		if (!id) return { error: new ClientError(400, "Не вказано ID публікації") };

		const parsed = parseInt(id);
		if (isNaN(parsed)) return { error: new ClientError(400, "ID публікації не є числом") };

		const result = await GetPublicationRequest(parsed, admin).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) return { error: result };

		const publication = result;

		return { publication };
	} catch (error) {
		return { error: new ClientError(500, "Помилка сервера") };
	}
};

const SearchCompany = async (params: Params<string>, admin?: boolean) => {
	try {
		const { id } = params;
		if (!id) return { error: new ClientError(400, "Не вказано ID компанії") };

		const parsed = parseInt(id);
		if (isNaN(parsed)) return { error: new ClientError(400, "ID компанії не є числом") };

		const result = await GetCompanyRequest(parsed, admin).catch((e) => {
			if (e instanceof ClientError) return e;
			if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
			if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
			return new ClientError(500, "Помилка сервера");
		});
		if (result instanceof ClientError) return { error: result };

		const company = result;

		return {
			company,
		};
	} catch (error) {
		return { error: new ClientError(500, "Помилка сервера") };
	}
};

const SearchProfile = async () => {
	const token = Cookies.get("token");
	if (!token) return { error: new ClientError(401, "Необхідно авторизуватися") };

	const result = await ProfileRequest(token).catch((e) => {
		if (e instanceof ClientError) {
			if (e.status === 401) return new ClientError(401, "Необхідно авторизуватися");
			if (e.status === 403) return new ClientError(403, "Необхідно авторизуватися");
		}
		if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
		return new ClientError(500, "Помилка сервера");
	});
	if (result instanceof ClientError) return { error: result };
	const user = result;

	const cart = user.Cart;
	const boughtData = user.Bought;
	const boughtItems = user.BoughtItems;
	const wishlist = user.Wishlist;
	const publications = user.Publications;
	const publicationsComments = user.CommentsList;
	const itemsRates = user.Rates;

	return { user, cart, boughtData, boughtItems, wishlist, publications, publicationsComments, itemsRates };
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
export const GetItems = async (params: GetItemsParams) => {
	const { admin = false, limit = 12, page = 1, sortBy = "nameAsc", searchParams = undefined } = params;
	const { sortBy: specificSortBy, descending } = ItemsSortSwitch(sortBy);

	const requestParams: GetAllItemsParams = {
		sortBy: specificSortBy,
		desc: descending,
		page,
		limit,
		hidden: admin ? undefined : false,

		name: searchParams?.name,
		priceFrom: searchParams?.priceFrom,
		priceTo: searchParams?.priceTo,
		releaseDateFrom: searchParams?.dateFrom?.toISOString().slice(0, 10),
		releaseDateTo: searchParams?.dateTo?.toISOString().slice(0, 10),
		discount: searchParams?.discount,
		includeGenres: !!searchParams?.genres,
		genresIds: searchParams?.genres?.map((genre) => genre.id),
		includeDevelopers: !!searchParams?.developers,
		developersIds: searchParams?.developers?.map((developer) => developer.id),
		includePublisher: !!searchParams?.publisher,
		publisherId: searchParams?.publisher?.id,
	};
	const result = await GetAllItemsRequest(requestParams);
	if (!result) return { error: new ClientError(500, "Помилка сервера") };

	let data = result.items;
	const totalCount = result.totalCount;
	const companies = result.companies;
	const genres = result.genres;

	if (searchParams) {
		data = data.filter((item) => {
			const { finalPrice } = calculateDiscount(item);
			let pass = true;
			if (searchParams.priceFrom) {
				pass = pass && finalPrice >= searchParams.priceFrom;
			}
			if (searchParams.priceTo) {
				pass = pass && finalPrice <= searchParams.priceTo;
			}
			return pass;
		});
	}

	return { data, totalCount, limit, page, sortBy, companies, genres };
};

type GetGenresParams = {
	admin?: boolean;
	limit?: number;
	page?: number;
	sortBy?: string;
	name?: string;
};
export const GetGenres = async (params: GetGenresParams) => {
	const { admin = false, limit = 12, page = 1, sortBy = "nameAsc", name = "" } = params;
	const { descending } = GenresSortSwitch(sortBy);

	const data = await GetAllGenresRequest({
		sortBy: "name",
		desc: descending,
		page,
		limit,
		hidden: admin,
		admin,
		name,
	}).catch((e) => {
		if (e instanceof ClientError) return e;
		if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
		if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
		return new ClientError(500, "Помилка сервера");
	});
	if (data instanceof ClientError) return { error: data };

	const genres = data.genres;
	const totalCount = data.totalCount;

	return { data: genres, totalCount, limit, page, sortBy };
};

type GetCompaniesParams = {
	admin?: boolean;
	limit?: number;
	page?: number;
	sortBy?: string;
	descending?: boolean;
	name?: string;
};
export const GetCompanies = async (params: GetCompaniesParams) => {
	const { admin = false, limit = 12, page = 1, sortBy = "nameAsc", name = "" } = params;
	const { sortBy: specificSortBy, descending } = CompaniesSortSwitch(sortBy);

	const result = await GetAllCompaniesRequest({
		name,
		sortBy: specificSortBy,
		desc: descending,
		page,
		limit,
		hidden: admin,
	}).catch((e) => {
		if (e instanceof ClientError) return e;
		if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
		if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
		return new ClientError(500, "Помилка сервера");
	});
	if (result instanceof ClientError) return { error: result };

	const data = result.companies;
	const totalCount = result.totalCount;

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
export const GetPublications = async (params: GetPublicationsParams) => {
	const { admin = false, limit = 12, page = 1, sortBy = "createdAtAsc", searchParams = undefined } = params;
	const { sortBy: specificSortBy, descending } = PublicationsSortSwitch(sortBy);

	const result = await GetAllPublicationsRequest({
		admin,
		limit,
		page,
		sortBy: specificSortBy,
		desc: descending,

		title: searchParams?.title,
		dateFrom: searchParams?.dateFrom,
		dateTo: searchParams?.dateTo,
	}).catch((e) => {
		if (e instanceof ClientError) return e;
		if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
		if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
		return new ClientError(500, "Помилка сервера");
	});
	if (result instanceof ClientError) return { error: result };

	const data = result.publications.filter((publication) => {
		let pass = true;
		if (searchParams?.dateFrom) {
			pass = pass && new Date(publication.createdAt).getTime() >= new Date(searchParams.dateFrom).getTime();
		}
		if (searchParams?.dateTo) {
			pass = pass && new Date(publication.createdAt).getTime() <= new Date(searchParams.dateTo).getTime();
		}
		if (searchParams?.tags) {
			pass = pass && searchParams.tags.every((tag) => publication.tags.includes(tag));
		}
		if (searchParams?.authors) {
			pass = pass && searchParams.authors.some((author) => publication.userId === author.id);
		}
		return pass;
	});
	const totalCount = result.totalCount;

	return { data, totalCount, limit, page, sortBy };
};

type GetUsersParams = {
	limit?: number;
	page?: number;
	sortBy?: string;
};
export const GetUsers = async (params: GetUsersParams) => {
	const token = Cookies.get("token");
	if (!token) return { error: new ClientError(401, "Необхідно авторизуватися") };

	const { limit = 12, page = 1, sortBy = "createdAtAsc" } = params;
	const { sortBy: specificSortBy, descending } = UsersSortSwitch(sortBy);

	const result = await GetAllUsersRequest(token, limit, page, specificSortBy, descending).catch((e) => {
		if (e instanceof ClientError) return e;
		if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
		if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
		return new ClientError(500, "Помилка сервера");
	});
	if (result instanceof ClientError) return { error: result };

	if (!result.data.users) return { error: new ClientError(500, "Не вдалося отримати користувачів") };

	const users = result.data.users;
	const totalCount = result.data.totalCount;

	return { data: users, totalCount, limit, page, sortBy };
};

type GetPublicationsCommentsParams = {
	limit?: number;
	page?: number;
	sortBy?: string;
};
export const GetPublicationsComments = async (params: GetPublicationsCommentsParams) => {
	const { limit = 12, page = 1, sortBy = "createdAtAsc" } = params;
	const { descending } = PublicationsCommentsSortSwitch(sortBy);

	const result = await GetAllPublicationsCommentsRequest({
		limit,
		page,
		sortBy: "createdAt",
		descending,
	}).catch((e) => {
		if (e instanceof ClientError) return e;
		if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
		if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
		return new ClientError(500, "Помилка сервера");
	});
	if (result instanceof ClientError) return { error: result };

	const comments = result.comments;
	const totalCount = result.totalCount;

	return { data: comments, totalCount, limit, page, sortBy };
};

type GetItemsRatesParams = {
	limit?: number;
	page?: number;
	sortBy?: string;
};
export const GetItemsRates = async (params: GetItemsRatesParams) => {
	const { limit = 12, page = 1, sortBy = "createdAtAsc" } = params;
	const { descending } = ItemsRatesSortSwitch(sortBy);

	const result = await GetAllItemsRatesRequest({
		limit,
		page,
		sortBy: "createdAt",
		descending,
	}).catch((e) => {
		if (e instanceof ClientError) return e;
		if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
		if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
		return new ClientError(500, "Помилка сервера");
	});
	if (result instanceof ClientError) return { error: result };

	const data = result.rates;
	const totalCount = result.totalCount;

	return { data, totalCount, limit, page, sortBy };
};

const GetStatistics = async () => {
	const token = Cookies.get("token");
	if (!token) return { error: new ClientError(401, "Необхідно авторизуватися") };

	const result = await GetStatisticsDataRequest(token).catch((e) => {
		if (e instanceof ClientError) return e;
		if (e instanceof Error) return new ClientError(500, "Помилка сервера: " + e.message);
		if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
		return new ClientError(500, "Помилка сервера");
	});
	if (result instanceof ClientError) return { error: result };

	return result;
};

export default function Router() {
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
							loader: async () => {
								console.log("profile loader");
								return await SearchProfile();
							},
						},
						{
							path: "/cart",
							element: <Cart />,
							loader: async () => {
								console.log("cart loader");
								const userData = await SearchProfile();
								if (userData.error) return { error: userData.error };

								const token = Cookies.get("token");
								if (!token) return { error: new ClientError(401, "Необхідно авторизуватися") };

								const { user, cart } = userData;
								const result = await SetUpCartRequest(token).catch((e) => {
									if (e instanceof ClientError) return e;
									if (e instanceof Error)
										return new ClientError(500, "Помилка сервера: " + e.message);
									if (e instanceof AxiosError) return new ClientError(e.code || "500", e.message);
									return new ClientError(500, "Помилка сервера");
								});
								if (result instanceof ClientError) return { error: result };

								return { user, cart, transactionId: result.transactionId };
							},
						},
						{
							path: "/cart/success",
							element: <CartSuccess />,
							loader: async () => {
								console.log("cart loader");
								return await SearchProfile();
							},
						},
						{
							path: "/shop/items",
							element: <Items />,
							loader: async () => {
								console.log("items loader");
								const { data, totalCount, limit, page, sortBy, error, companies, genres } =
									await GetItems({});

								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
									error,
									companies,
									genres,
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
							loader: async () => {
								console.log("genres loader");
								const { data, error } = await GetGenres({});
								return { data, error };
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
							loader: async () => {
								console.log("companies loader");
								const { data, totalCount, limit, page, sortBy, error } = await GetCompanies({});
								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
									error,
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
							loader: async () => {
								console.log("news loader");
								const { data, totalCount, limit, page, sortBy } = await GetPublications({});
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
							loader: async () => {
								console.log("admin statistics loader");
								return await GetStatistics();
							},
						},
						{
							path: "/admin/users",
							element: <AdminUsers />,
							loader: async () => {
								console.log("admin users loader");
								const { data, totalCount, limit, page, sortBy, error } = await GetUsers({});
								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
									error,
								};
							},
						},
						{
							path: "/admin/items",
							element: <AdminItems />,
							loader: async () => {
								console.log("admin items loader");
								const { data, totalCount, limit, page, sortBy, error } = await GetItems({
									admin: true,
								});

								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
									error,
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
							loader: async () => {
								const genres = await GetGenres({ admin: true });
								if (genres.error) return { error: genres.error };

								const companies = await GetCompanies({ admin: true });
								if (companies.error) return { error: companies.error };

								return { item: undefined, genres: genres.data, companies: companies.data };
							},
						},
						{
							path: "/admin/items/:id/edit",
							element: <AdminItemForm />,
							loader: async ({ params }) => {
								console.log("admin item edit loader");
								const itemData = await SearchItem(params, true);
								if (itemData.error) return { error: itemData.error };

								const genres = await GetGenres({ admin: true });
								if (genres.error) return { error: genres.error };

								const companies = await GetCompanies({ admin: true });
								if (companies.error) return { error: companies.error };

								return { item: itemData.item, genres: genres.data, companies: companies.data };
							},
						},
						{
							path: "/admin/genres",
							element: <AdminGenres />,
							loader: async () => {
								console.log("admin genres loader");
								const { data, totalCount, sortBy, limit, page, error } = await GetGenres({
									admin: true,
								});
								return {
									data,
									totalCount,
									initSortBy: sortBy,
									initLimit: limit,
									initPage: page,
									error,
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
							loader: async () => {
								console.log("admin companies loader");
								const { data, totalCount, sortBy, limit, page, error } = await GetCompanies({
									admin: true,
								});
								return {
									data,
									totalCount,
									initSortBy: sortBy,
									initLimit: limit,
									initPage: page,
									error,
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
							loader: async () => {
								console.log("admin news loader");
								const { data, totalCount, sortBy, limit, page, error } = await GetPublications({
									admin: true,
								});
								return {
									data,
									totalCount,
									initSortBy: sortBy,
									initLimit: limit,
									initPage: page,
									error,
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
							path: "/admin/comments/news",
							element: <AdminNewsComments />,
							loader: async () => {
								console.log("admin news comments loader");
								const { data, totalCount, limit, page, sortBy, error } = await GetPublicationsComments(
									{}
								);
								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
									error,
								};
							},
						},
						{
							path: "/admin/comments/items",
							element: <AdminItemsComments />,
							loader: async () => {
								console.log("admin items comments loader");
								const { data, totalCount, limit, page, sortBy, error } = await GetItemsRates({});
								return {
									data,
									totalCount,
									initLimit: limit,
									initPage: page,
									initSortBy: sortBy,
									error,
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
