import axios from "axios";
import { Publication, Comment } from "./Publications";
import { Item, ItemRate, Wishlist } from "./Items";
import { User } from "./User";
import { Company } from "./Companies";
import { Genre } from "./Genres";

type SetViolationParams = {
	violation: boolean;
	violation_reason?: string;
};
export const SetPublicationViolationRequest = async (
	token: string,
	id: number,
	{ violation, violation_reason }: SetViolationParams
) => {
	return await axios
		.patch<{ message: string; result: Publication }>(
			`/api/moderation/news/${id}`,
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
	return await axios
		.patch<{ message: string; result: Comment }>(
			`/api/moderation/comments/${id}`,
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
	return await axios
		.patch<{ message: string; result: ItemRate }>(
			`/api/moderation/rates/${id}`,
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
	return await axios
		.get<GetStatisticsDataResponse>(`/api/moderation/statistics`, {
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
	return await axios
		.patch<{ message: string; result: User }>(
			`/api/user/toggleModerator/${id}`,
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
	return await axios
		.patch<{ message: string; result: User }>(
			`/api/user/setRole/${id}`,
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
