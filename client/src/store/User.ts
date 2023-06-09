import { atom, selector, SetterOrUpdater } from "recoil";
import Cookies from "js-cookie";
import jwt_decode, { JwtPayload } from "jwt-decode";

export type User = {
	id: string | number;
	login: string;
	email: string;
	role: string;
	image: string;
};

export const userState = atom<User | undefined>({
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

		const decoded = jwt_decode<JwtPayload & User>(token);
		if (decoded.exp && decoded.exp < Date.now() / 1000) {
			Cookies.remove("token");
			return undefined;
		}

		const data: User = {
			id: decoded.id,
			login: decoded.login,
			email: decoded.email,
			role: decoded.role,
			image: decoded.image,
		};

		return data;
	},
});

export const LogOut = (setUser: SetterOrUpdater<User | undefined>) => {
	Cookies.remove("token");
	setUser(undefined);

	return true;
};

export const LogIn = (setUser: SetterOrUpdater<User | undefined>, token?: string) => {
	if (!token) throw new Error("No token provided");

	const decoded = jwt_decode<JwtPayload & User>(token);
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
