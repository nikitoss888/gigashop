import { type AxiosError } from "axios";
import { Genre } from "./Genres";
import { Company } from "./Companies";
import { User } from "./User";
import axiosInstance from "./axiosInstance";

export type Item = {
	id: number;
	name: string;
	description: string;
	releaseDate: string;
	price: number;
	amount: number;
	discount: boolean;
	discountFrom: string | null;
	discountTo: string | null;
	discountSize: number | null;
	mainImage: string;
	images: string[];
	coverImage: string | null;
	characteristics: { [key: string]: string | number | boolean };
	hide: boolean;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
	company_publisherId: number | null;
};
export type ItemRate = {
	id: number;
	content: string;
	rate: number;
	hide: boolean;
	violation: boolean;
	violation_reason: string;
	createdAt: string;
	updatedAt: string | null;
	userId: number;
	itemId: number;
};
export type ItemCart = {
	id: number;
	userId: number;
	itemId: number;
	transactionId?: string | null;
	createdAt: string;
	updatedAt: string | null;
};
export type ItemBought = {
	id: number;
	itemId: number;
	transactionId: string;
	createdAt: string;
	userId: number;
};
export type Wishlist = {
	id: number;
	userId: number;
	itemId: number;
	createdAt: string;
	updatedAt: string | null;
};

export type GetAllItemsParams = {
	name?: string;
	description?: string;
	price?: number;
	priceFrom?: number;
	priceTo?: number;

	amount?: number;
	amountFrom?: number;
	amountTo?: number;

	releaseDate?: string;
	releaseDateFrom?: string;
	releaseDateTo?: string;

	discount?: boolean;
	discountFrom?: string;
	discountTo?: string;
	discountSize?: number;
	discountSizeFrom?: number;
	discountSizeTo?: number;

	includePublisher?: boolean;
	publisherId?: number;

	includeDevelopers?: boolean;
	developersIds?: number[];

	includeGenres?: boolean;
	genresIds?: number[];

	includeRated?: boolean;
	includeWishlisted?: boolean;

	sortBy?: string;
	desc?: boolean;
	page?: number;
	limit?: number;
	hidden?: boolean;
};
type GetAllReturn = {
	items: (Item & {
		Publisher: Company | null;
		Developers: Company[];
		Genres: Genre[];
		WishlistedUsers: User[];
		Rates: (ItemRate & {
			User: User;
		})[];
	})[];
	companies: Company[];
	genres: Genre[];
	totalCount: number;
};
export const GetAllItemsRequest = async (params: GetAllItemsParams) => {
	console.log({ params });
	return await axiosInstance
		.get<GetAllReturn>(`/shop/items`, {
			params: params,
		})
		.then((res) => {
			return res.data;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

type GetItemReturn = Item & {
	Publisher: Company | null;
	Developers: Company[];
	Genres: Genre[];
	Rates: (ItemRate & {
		User: User;
	})[];
	WishlistedUsers: User[];
	CartedUsers: User[];
};
export const GetItemRequest = async (id: number, admin?: boolean) => {
	return await axiosInstance
		.get<GetItemReturn>(`/shop/items/${id}`, {
			params: {
				includeHidden: admin,
				includePublisher: true,
				includeGenres: true,
				includeDevelopers: true,
				includeRated: true,
				includeInCart: true,
				includeWishlisted: true,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

type CreateItemParams = {
	name: string;
	description: string;
	releaseDate: string;
	price: number;
	amount: number;
	discount: boolean;
	discountFrom: string | null;
	discountTo: string | null;
	discountSize: number | null;
	mainImage: string;
	images: string[];
	coverImage: string | null;
	characteristics: { [key: string]: string | number | boolean };
	hide: boolean;
	publisherId: number | null;
	developersIds: number[];
	genresIds: number[];
};
export const CreateItemRequest = async (token: string, params: CreateItemParams) => {
	return await axiosInstance
		.post<Item>(
			`/shop/items`,
			{
				...params,
				releaseDate: new Date(params.releaseDate).toISOString().slice(0, 10),
				discountFrom: params.discountFrom ? new Date(params.discountFrom).toISOString().slice(0, 10) : null,
				discountTo: params.discountTo ? new Date(params.discountTo).toISOString().slice(0, 10) : null,
				characteristics: JSON.stringify(params.characteristics),
			},
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

type UpdateItemParams = {
	name?: string;
	description?: string;
	releaseDate?: string;
	price?: number;
	amount?: number;
	discount?: boolean;
	discountFrom?: string | null;
	discountTo?: string | null;
	discountSize?: number | null;
	mainImage?: string;
	images?: string[];
	coverImage?: string | null;
	characteristics?: { [key: string]: string | number | boolean };
	hide?: boolean;
	publisherId?: number | null;
	developersIds?: number[];
	genresIds?: number[];
};
export const UpdateItemRequest = async (token: string, id: number, params: UpdateItemParams) => {
	return await axiosInstance
		.patch<Item>(
			`/shop/items/${id}`,
			{
				...params,
				releaseDate: params.releaseDate ? new Date(params.releaseDate).toISOString().slice(0, 10) : undefined,
				discountFrom: params.discountFrom
					? new Date(params.discountFrom).toISOString().slice(0, 10)
					: undefined,
				discountTo: params.discountTo ? new Date(params.discountTo).toISOString().slice(0, 10) : undefined,
				characteristics: params.characteristics ? JSON.stringify(params.characteristics) : null,
			},
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

export const DeleteItemRequest = async (token: string, id: number) => {
	return await axiosInstance
		.delete<{ ok: true }>(`/shop/items/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((res) => {
			return res.data.ok;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

export const calculateDiscount = (item: Item) => {
	const date = new Date();
	let isDiscount = item.discount;
	if (item.discountFrom) isDiscount = isDiscount && date.getTime() >= new Date(item.discountFrom).getTime();
	if (item.discountTo) isDiscount = isDiscount && date.getTime() <= new Date(item.discountTo).getTime();

	const finalPrice =
		isDiscount && item.discountSize ? item.price - (item.price * item.discountSize) / 100 : item.price;
	return { isDiscount, finalPrice };
};

export const SetItemRateRequest = async (token: string, itemId: number, rate: number, content: string) => {
	return await axiosInstance
		.post<{ message: string; rate: ItemRate; user: User }>(
			`/shop/items/${itemId}/rate`,
			{
				rate,
				content,
			},
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

export const DeleteItemRateRequest = async (token: string, itemId: number) => {
	return await axiosInstance
		.delete<{ ok: boolean }>(`/shop/items/${itemId}/rate`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((res) => {
			return res.data.ok;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

export const ToggleCartItemRequest = async (token: string, itemId: number) => {
	return await axiosInstance
		.post<{ message: string; ok: boolean }>(
			`/shop/items/${itemId}/toggleCart`,
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

export const ToggleWishlistItemRequest = async (token: string, itemId: number) => {
	return await axiosInstance
		.post<{ message: string; ok: boolean }>(
			`/shop/items/${itemId}/toggleWishlist`,
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
