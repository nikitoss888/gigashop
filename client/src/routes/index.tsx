import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
							element: <p>Home page</p>,
						},
						{
							path: "/about",
							element: <p>About page</p>,
						},
						{
							path: "/profile",
							element: <p>Profile page</p>,
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
							path: "/shop/items",
							element: <Items />,
						},
						{
							path: "/shop/items/:id",
							element: <Item />,
						},
						{
							path: "/shop/genres",
							element: <Genres />,
						},
						{
							path: "/shop/genres/:id",
							element: <Genre />,
						},
						{
							path: "/shop/companies",
							element: <Companies />,
						},
						{
							path: "/shop/companies/:id",
							element: <Company />,
						},
						{
							path: "/news",
							element: <NewsList />,
						},
						{
							path: "/news/:id",
							element: <NewsItem />,
						},
						{
							path: "/news/create",
							element: <NewsForm />,
						},
						{
							path: "/news/:id/edit",
							element: <NewsForm />,
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
							path: "/admin/items",
							element: <AdminItems />,
						},
						{
							path: "/admin/items/:id",
							element: <AdminItem />,
						},
						{
							path: "/admin/items/create",
							element: <AdminItemForm />,
						},
						{
							path: "/admin/items/:id/edit",
							element: <AdminItemForm />,
						},
						{
							path: "/admin/genres",
							element: <p>Admin genres page</p>,
						},
						{
							path: "/admin/genres/create",
							element: <p>Admin create genre page</p>,
						},
						{
							path: "/admin/genres/:id/edit",
							element: <p>Admin edit genre page</p>,
						},
						{
							path: "/admin/companies",
							element: <p>Admin companies page</p>,
						},
						{
							path: "/admin/companies/create",
							element: <p>Admin create company page</p>,
						},
						{
							path: "/admin/companies/:id/edit",
							element: <p>Admin edit company page</p>,
						},
						{
							path: "/admin/news",
							element: <AdminNews />,
						},
						{
							path: "/admin/news/:id",
							element: <AdminNewsItem />,
						},
						{
							path: "/admin/news/create",
							element: <AdminNewsForm />,
						},
						{
							path: "/admin/news/:id/edit",
							element: <AdminNewsForm />,
						},
					],
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}
