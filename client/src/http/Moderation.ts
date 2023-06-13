import { Publication, Comment } from "./Publications";
import { Item, ItemRate, Wishlist } from "./Items";
import { User } from "./User";
import { Company } from "./Companies";
import { Genre } from "./Genres";
import axiosInstance from "./axiosInstance";

type SetViolationParams = {
	violation: boolean;
	violation_reason?: string;
};
export const SetPublicationViolationRequest = async (
	token: string,
	id: number,
	{ violation, violation_reason }: SetViolationParams
) => {
	return await axiosInstance
		.patch<{ message: string; result: Publication }>(
			`/moderation/news/${id}`,
			{
				violation,
				violation_reason,
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
		.catch((err) => {
			throw new Error(err.message);
		});
};

export const SetCommentViolationRequest = async (
	token: string,
	id: number,
	{ violation, violation_reason }: SetViolationParams
) => {
	return await axiosInstance
		.patch<{ message: string; result: Comment }>(
			`/moderation/comments/${id}`,
			{
				violation,
				violation_reason,
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
		.catch((err) => {
			throw new Error(err.message);
		});
};

export const SetRateViolationRequest = async (
	token: string,
	id: number,
	{ violation, violation_reason }: SetViolationParams
) => {
	return await axiosInstance
		.patch<{ message: string; result: ItemRate }>(
			`/moderation/rates/${id}`,
			{
				violation,
				violation_reason,
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
		.catch((err) => {
			throw new Error(err.message);
		});
};

type GetStatisticsDataResponse = {
	Users: User[];
	Items: (Item & {
		Developers: Company[];
		Publisher: Company;
		Genres: Genre[];
	})[];
	Publications: Publication[];
	Companies: Company[];
	Genres: Genre[];
	ItemsRates: ItemRate[];
	PublicationsComments: Comment[];
	Wishlists: Wishlist[];
};
export const GetStatisticsDataRequest = async (token: string) => {
	return await axiosInstance
		.get<GetStatisticsDataResponse>(`/moderation/statistics`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

export const ToggleRoleRequest = async (token: string, id: number) => {
	return await axiosInstance
		.patch<{ message: string; result: User }>(
			`/user/toggleModerator/${id}`,
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
		.catch((err) => {
			throw new Error(err.message);
		});
};

export const SetRoleRequest = async (token: string, id: number, role: string) => {
	return await axiosInstance
		.patch<{ message: string; result: User }>(
			`/user/setRole/${id}`,
			{
				role,
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
		.catch((err) => {
			throw new Error(err.message);
		});
};
