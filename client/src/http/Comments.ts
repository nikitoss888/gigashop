import axios from "axios";
import { ItemRate, Item } from "./Items";
import { Publication, Comment } from "./Publications";
import { User } from "./User";

type GetAllCommentsParams = {
	sortBy?: string;
	descending?: boolean;
	limit?: number;
	page?: number;
};
type GetAllCommentsReturn = {
	comments: (Comment & {
		User: User;
		Publication: Publication;
	})[];
	totalCount: number;
};
export const GetAllPublicationsCommentsRequest = async (params: GetAllCommentsParams) => {
	return await axios
		.get<GetAllCommentsReturn>(`/api/comments/news`, {
			params: {
				sortBy: params.sortBy,
				descending: params.descending,
				limit: params.limit,
				page: params.page,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

type GetAllRatesParams = {
	sortBy?: string;
	descending?: boolean;
	limit?: number;
	page?: number;
};
type GetAllRatesReturn = {
	rates: (ItemRate & {
		Item: Item;
		User: User;
	})[];
	totalCount: number;
};
export const GetAllItemsRatesRequest = async (params: GetAllRatesParams) => {
	return await axios
		.get<GetAllRatesReturn>(`/api/comments/items`, {
			params: {
				sortBy: params.sortBy,
				descending: params.descending,
				limit: params.limit,
				page: params.page,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};
