import { type AxiosError } from "axios";
import { ItemRate, ItemBought, Item } from "./Items";
import { Comment, Publication } from "./Publications";
import axiosInstance from "./axiosInstance";

export type LoginResults = {
	message?: string;
	token: string;
};
export const LogInRequest = async (credentials: string, password: string) => {
	return await axiosInstance
		.post<LoginResults>(`/user/login`, {
			credentials,
			password,
		})
		.then((res) => {
			return res.data;
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
	try {
		const res = await axiosInstance
			.post<{ message: string; token: string }>(`/user/register`, {
				email,
				login,
				firstName,
				lastName,
				password,
				image,
			})
			.then((res) => {
				return res.data;
			});

		console.log({ res });
		return res;
	} catch (err) {
		console.log({ err });
		if (err instanceof Error) throw err;
		throw new Error();
	}
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
	return await axiosInstance
		.get<Profile>(`/user/profile`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params: {
				includeRates: true,
				includeWishlist: true,
				includePublications: true,
				includePublicationComments: true,
				includeBought: true,
				includeCart: true,
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
	return await axiosInstance
		.get<{ users: User[]; totalCount: number; message?: string }>(`/user/all`, {
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
	return await axiosInstance
		.delete<{ message: string; ok: boolean }>(`/user/cart`, {
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
	return await axiosInstance
		.post<{ message: string; transactionId: string }>(
			`/user/cart/setup`,
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
