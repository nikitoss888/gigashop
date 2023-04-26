import Layout from "../components/Layout";
import { Outlet } from "react-router-dom";

export default function RootPage() {
	return (
		<Layout>
			<Outlet />
		</Layout>
	);
}
