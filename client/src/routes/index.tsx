import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootPage from "./RootPage";
import { useRecoilState } from "recoil";
import { userState } from "../store/User";
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

export default function Router() {
	const [user, _] = useRecoilState(userState);

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
						// ToDo: Implement register page
						{
							path: "/register",
							element: <p>Register page</p>,
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
					],
				},
				{
					path: "/admin",
					element: <p>Admin site</p>,
					loader: () => {
						if (!user) throw new Response("Unauthorized", { status: 401 });
						if (user.role !== "admin") throw new Response("Forbidden", { status: 403 });
					},
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}
