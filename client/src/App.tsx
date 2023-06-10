import { useRecoilState } from "recoil";
import Router from "./routes";
import Cookies from "js-cookie";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { LogIn, LogOut, UserAtom, userState } from "./store/User";
import { useEffectOnce } from "usehooks-ts";

function App() {
	const [_, setUser] = useRecoilState(userState);
	const token = Cookies.get("token");

	useEffectOnce(() => {
		if (token) {
			const decoded = jwt_decode<JwtPayload & UserAtom>(token);

			if (decoded.exp && decoded.exp < Date.now() / 1000) {
				LogOut(setUser);
			} else if (decoded.id && decoded.login && decoded.email && decoded.role && decoded.image) {
				LogIn(setUser, token);
			}
		}
	});

	return <Router />;
}

export default App;
