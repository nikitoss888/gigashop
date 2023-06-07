import Layout from "../components/Layout";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./ErrorPage";

export default function RootPage() {
	return (
		<ErrorBoundary FallbackComponent={ErrorPage}>
			<Layout>
				<Outlet />
			</Layout>
		</ErrorBoundary>
	);
}
