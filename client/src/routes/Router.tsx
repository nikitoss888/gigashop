import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import RootPage from "./RootPage";
import { useRecoilState } from "recoil";
import { userState } from "../store/User";
import Items from "./Items";
import Item from "./Item";
import Genres from "./Genres";

export default function Router() {
	const [user, _] = useRecoilState(userState);
	const admin = user?.role === "admin";

	const router = createBrowserRouter([
		{
			path: "",
			element: <RootPage />,
			errorElement: <ErrorPage />,
			children: [
				{
					path: "/",
					element: <Outlet />,
					errorElement: <ErrorPage />,
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
							path: "/shop",
							children: [
								{
									path: "/shop/",
									element: <p>Shop page</p>,
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
									path: "/shop/companies",
									element: <p>Shop companies page</p>,
								},
							],
						},
					],
				},
				{
					path: "/admin",
					element: admin ? <p>Admin site</p> : <p>Access denied</p>,
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}
