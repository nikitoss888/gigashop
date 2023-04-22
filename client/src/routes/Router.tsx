import {BrowserRouter, Route, Routes} from "react-router-dom";
import ErrorPage from "./ErrorPage";
import RootPage from "./RootPage";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" errorElement={<ErrorPage />} element={<RootPage />}>
                    <Route path="/" element={<p>Hello world!</p>} />
                    <Route path="/admin" element={<p>Admin page</p>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}