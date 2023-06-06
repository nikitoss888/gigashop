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
							element: <p>Create news item</p>,
						},
						{
							path: "/news/:id/edit",
							element: <p>Edit news item</p>,
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
							path: "/admin/items/create",
							element: <p>Admin create item page</p>,
						},
						{
							path: "/admin/items/:id/edit",
							element: <p>Admin edit item page</p>,
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
							element: <p>Admin news page</p>,
						},
						{
							path: "/admin/news/create",
							element: <p>Admin create news page</p>,
						},
						{
							path: "/admin/news/:id/edit",
							element: <p>Admin edit news page</p>,
						},
					],
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}
