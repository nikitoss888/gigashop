import { createBrowserRouter, Params, RouterProvider } from "react-router-dom";
import RootPage from "./RootPage";
// import { useRecoilState } from "recoil";
// import { userState } from "../store/User";
import Items from "./Items";
import Item from "./Item";
import Genres from "./Genres";
import Genre from "./Genre";
import ErrorPage from "./ErrorPage";
import Companies from "./Companies";
import Company from "./Company";
import NewsList from "./NewsList";
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
import AdminGenres from "./Admin/AdminGenres";
import AdminGenre from "./Admin/AdminGenre";
import { default as GenresList } from "../mock/Genres";
import { default as ItemsList } from "../mock/Items";
import { default as CompaniesList } from "../mock/Companies";
import { default as PublicationsList } from "../mock/Publications";
import { default as PublicationsCommentsList } from "../mock/PublicationsComments";
import { default as ItemsRatesList } from "../mock/ItemsRates";
import Wishlists from "../mock/Wishlists";
import ClientError from "../ClientError";
import AdminGenreForm from "./Admin/AdminGenreForm";
import AdminCompanies from "./Admin/AdminCompanies";
import AdminCompanyForm from "./Admin/AdminCompanyForm";
import AdminNewsComments from "./Admin/AdminNewsComments";
import Users from "../mock/Users";
import AdminItemsComments from "./Admin/AdminItemsComments";
import AdminUsers from "./Admin/AdminUsers";
import Home from "./Home";
import AdminCompany from "./Admin/AdminCompany";
import Profile from "./Profile";
import ItemCart from "../mock/ItemCart";
import AdminStatistics from "./Admin/AdminStatistics";

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

const SearchGenre = (params: Params<string>, allItems?: boolean) => {
	try {
		const { id } = params;
		if (!id) return { error: new ClientError(400, "Не вказано ID жанру") };

		const parsed = parseInt(id);
		if (isNaN(parsed)) return { error: new ClientError(400, "ID жанру не є числом") };

		const genre = GenresList.find((genre) => genre.id === parsed);
		if (!genre) return { error: new ClientError(404, "Жанр за даним ID не знайдено") };

		let items = ItemsList.filter((item) => item.genresIds?.includes(genre.id));
		if (!allItems) items = items.filter((item) => !item.hide);
		const totalCount = items.length;

		genre.items = items;

		return { genre, totalCount };
	} catch (error) {
		return { error: new ClientError(500, "Помилка сервера") };
	}
};

const SearchPublication = (params: Params<string>, allComments?: boolean) => {
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
		if (!allComments) comments = comments.filter((comment) => !comment.violation && !comment.hide);
		comments.forEach((comment) => {
			comment.user = Users.find((user) => user.id === comment.userId);
		});
		publication.comments = comments;

		return { publication };
	} catch (error) {
		return { error: new ClientError(500, "Помилка сервера") };
	}
};

const SearchCompany = (params: Params<string>, allItems?: boolean) => {
	try {
		const { id } = params;
		if (!id) return { error: new ClientError(400, "Не вказано ID компанії") };

		const parsed = parseInt(id);
		if (isNaN(parsed)) return { error: new ClientError(400, "ID компанії не є числом") };

		const company = CompaniesList.find((company) => company.id === parsed);
		if (!company) return { error: new ClientError(404, "Компанію за даним ID не знайдено") };

		let developed = ItemsList.filter((item) => item.developersIds?.includes(company.id));
		if (!allItems) developed = developed.filter((item) => !item.hide);
		const developedTotalCount = developed.length;
		company.developed = developed;

		let published = ItemsList.filter((item) => item.publisherId === company.id);
		if (!allItems) published = published.filter((item) => !item.hide);
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

const SearchUser = () => {
	const user = Users[0];

	const itemCarts = ItemCart.filter((item) => item.userId === user.id);
	const cart = ItemsList.filter((item) => itemCarts.map((itemCart) => itemCart.itemId).includes(item.id));
	user.cart = cart;

	const wishlist = Wishlists.filter((item) => item.userId === user.id);
	const wishlistedItems = ItemsList.filter((item) => wishlist.map((wishlist) => wishlist.itemId).includes(item.id));
	user.wishlist = wishlistedItems;

	const publications = PublicationsList.filter((publication) => publication.userId === user.id);
	user.publications = publications;

	const publicationsComments = PublicationsCommentsList.filter((comment) => comment.userId === user.id);
	user.publicationsComments = publicationsComments;

	const itemsRates = ItemsRatesList.filter((rate) => rate.userId === user.id);
	user.itemsRates = itemsRates;

	return { user };
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
								return SearchUser();
							},
						},
						{
							path: "/shop/items",
							element: <Items />,
							loader: () => {
								console.log("items loader");
								const data = ItemsList.filter((item) => !item.hide && !item.deletedAt);
								return {
									data,
									totalCount: data.length,
									initLimit: 12,
									initPage: 0,
									initSortBy: "releaseDateAsc",
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
								const data = GenresList.filter((genre) => !genre.hide && !genre.deletedAt);
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
								const data = CompaniesList.filter((company) => !company.hide && !company.deletedAt);
								return {
									data,
									totalCount: data.length,
									initLimit: 12,
									initPage: 0,
									initSortBy: "nameAsc",
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
								const data = PublicationsList.filter((item) => !item.hide && !item.violation && !item.deletedAt);
								return {
									data,
									totalCount: data.length,
									initLimit: 12,
									initPage: 0,
									initSortBy: "createdAtAsc",
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
								return {
									users: Users,
									items: ItemsList,
									publications: PublicationsList,
									companies: CompaniesList,
									genres: GenresList,
									itemsRates: ItemsRatesList,
									publicationsComments: PublicationsCommentsList,
									wishlists: Wishlists,
								};
							},
						},
						{
							path: "/admin/users",
							element: <AdminUsers />,
							loader: () => {
								console.log("admin users loader");
								return { data: Users, totalCount: Users.length };
							},
						},
						{
							path: "/admin/items",
							element: <AdminItems />,
							loader: () => {
								console.log("admin items loader");
								return { data: ItemsList, totalCount: ItemsList.length };
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
								return { data: GenresList, totalCount: GenresList.length };
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
								return { data: CompaniesList, totalCount: CompaniesList.length };
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
								return { data: PublicationsList, totalCount: PublicationsList.length };
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
								return { data: PublicationsCommentsList, totalCount: PublicationsCommentsList.length };
							},
						},
						{
							path: "/admin/comments/items",
							element: <AdminItemsComments />,
							loader: () => {
								console.log("admin items comments loader");
								return { data: ItemsRatesList, totalCount: ItemsRatesList.length };
							},
						},
					],
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}
