import { atom, selector, SetterOrUpdater } from "recoil";
import Cookies from "js-cookie";
import jwt_decode, { JwtPayload } from "jwt-decode";

export type UserAtom = {
	id: string | number;
	login: string;
	email: string;
	role: string;
	image: string;
};

export const userState = atom<UserAtom | undefined>({
	key: "userState",
	default: undefined,
});

export const getUser = selector({
	key: "getUser",
	get: ({ get }) => {
		const user = get(userState);
		if (user) return user;

		const token = Cookies.get("token");
		if (!token) return undefined;

		const decoded = jwt_decode<JwtPayload & UserAtom>(token);
		if (decoded.exp && decoded.exp < Date.now() / 1000) {
			Cookies.remove("token");
			return undefined;
		}

		const data: UserAtom = {
			id: decoded.id,
			login: decoded.login,
			email: decoded.email,
			role: decoded.role,
			image: decoded.image,
		};

		return data;
	},
});

export const LogOut = (setUser: SetterOrUpdater<UserAtom | undefined>) => {
	Cookies.remove("token");
	setUser(undefined);

	return true;
};

export const LogIn = (setUser: SetterOrUpdater<UserAtom | undefined>, token: string) => {
	const decoded = jwt_decode<JwtPayload & UserAtom>(token);
	if (decoded.exp && decoded.exp < Date.now() / 1000) throw new Error("Token expired");

	Cookies.set("token", token);
	setUser({
		id: decoded.id,
		login: decoded.login,
		email: decoded.email,
		role: decoded.role,
		image: decoded.image,
	});

	return true;
};
