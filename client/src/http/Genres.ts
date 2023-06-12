import axios, { AxiosError } from "axios";
import { Item } from "./Items";

export type Genre = {
	id: number;
	description?: string;
	name: string;
	createdAt: string;
	updatedAt: string | null;
	hide: boolean;
};

type GetAllGenresParams = {
	name?: string;
	desc?: boolean;
	sortBy?: string;
	limit: number;
	page: number;
	hidden?: boolean;
	admin?: boolean;
};
type GetAllGenresReturn = {
	genres: (Genre & {
		Items: Item[];
	})[];
	totalCount: number;
};
export const GetAllGenresRequest = async (params: GetAllGenresParams) => {
	const requestParams = params.admin
		? {
				desc: params.desc,
				sortBy: params.sortBy,
		  }
		: {};

	return await axios
		.get<GetAllGenresReturn>(`/api/shop/genres`, {
			params: {
				...requestParams,
				name: params.name,
				limit: params.admin ? params.limit : 9999,
				page: params.admin ? params.page : 1,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

type GetGenreReturn = Genre & {
	Items?: Item[];
};
export const GetGenreRequest = async (id: number, admin?: boolean) => {
	return await axios
		.get<GetGenreReturn>(`/api/shop/genres/${id}`, {
			params: {
				includeItems: true,
				includeHidden: admin,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

type CreateGenreParams = {
	name: string;
	description: string;
	hide?: boolean;
};
type CreateGenreReturn = Genre;
export const CreateGenreRequest = async (token: string, params: CreateGenreParams) => {
	return await axios
		.post<CreateGenreReturn>(`/api/shop/genres`, params, {
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

type UpdateGenreParams = {
	name?: string;
	description?: string;
	hide?: boolean;
};
type UpdateGenreReturn = Genre;
export const UpdateGenreRequest = async (token: string, id: number, params: UpdateGenreParams) => {
	return await axios
		.patch<UpdateGenreReturn>(`/api/shop/genres/${id}`, params, {
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

export const DeleteGenreRequest = async (token: string, id: number) => {
	return await axios
		.delete<{ ok: boolean }>(`/api/shop/genres/${id}`, {
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
