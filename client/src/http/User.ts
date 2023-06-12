import axios, { type AxiosError } from "axios";
import { ItemRate, ItemBought, Item } from "./Items";
import { Comment, Publication } from "./Publications";

export type LoginResults = {
	message?: string;
	token: string;
};
export const LogInRequest = async (credentials: string, password: string) => {
	return await axios
		.post<LoginResults>(`/api/user/login`, {
			credentials,
			password,
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

export type RegisterParams = {
	email: string;
	login: string;
	firstName: string;
	lastName: string;
	password: string;
	image: string;
};
export const RegisterRequest = async ({ login, email, password, firstName, lastName, image }: RegisterParams) => {
	return await axios
		.post<{ message: string; token: string }>(`/api/user/register`, {
			email,
			login,
			firstName,
			lastName,
			password,
			image,
		})
		.then((res) => {
			return res.data;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

export type User = {
	id: number;
	login: string;
	email: string;
	image: string;
	firstName: string;
	lastName: string;
	role: string;
	isBlocked: boolean;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
};
export type Profile = User & {
	Cart: Item[];
	Bought: ItemBought[];
	Rates: (ItemRate & {
		Item: Item;
	})[];
	Wishlist: Item[];
	Publications: Publication[];
	CommentsList: Comment[];
	BoughtItems: Item[];
};
export const ProfileRequest = async (token: string) => {
	return await axios
		.get<Profile>(`/api/user/profile`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params: {
				includeRates: true,
				includeWishlist: true,
				includePublications: true,
				includePublicationComments: true,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

export const GetAllUsersRequest = async (token: string, limit: number, page: number, sortBy: string, desc: boolean) => {
	return await axios
		.get<{ users: User[]; totalCount: number; message?: string }>(`/api/user/all`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params: {
				limit,
				page,
				sortBy,
				desc,
			},
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

export const ClearCartRequest = async (token: string) => {
	return await axios
		.delete<{ message: string; ok: boolean }>(`/api/user/cart`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

export const SetUpCartRequest = async (token: string) => {
	return await axios
		.post<{ message: string; transactionId: string }>(
			`/api/user/cart/setup`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		.then((res) => {
			return res.data;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};
