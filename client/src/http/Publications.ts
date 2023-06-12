import axios, { AxiosError } from "axios";
import { User } from "./User";

export type Publication = {
	id: number;
	title: string;
	content: string;
	hide: boolean;
	tags: string[];
	violation: boolean;
	violation_reason: string;
	userId: number;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
};

export type Comment = {
	id: number;
	content: string;
	rate: number;
	createdAt: string;
	updatedAt: string | null;
	violation: boolean;
	violation_reason: string;
	hide: boolean;
	userId: number;
	publicationId: number;
};

type GetAllPublicationsParams = {
	admin?: boolean;
	limit?: number;
	page?: number;
	sortBy?: string;
	desc?: boolean;

	title?: string;
	dateFrom?: Date;
	dateTo?: Date;
};
type GetAllPublicationsReturn = {
	publications: (Publication & {
		AuthoredUser: User;
	})[];
	totalCount: number;
};
export const GetAllPublicationsRequest = async (params: GetAllPublicationsParams) => {
	return await axios
		.get<GetAllPublicationsReturn>(`/api/news`, {
			params: {
				title: params.title,
				dateFrom: params.dateFrom?.toISOString().slice(0, 10),
				dateTo: params.dateTo?.toISOString().slice(0, 10),
				limit: params.limit,
				page: params.page,
				sortBy: params.sortBy,
				includeHidden: params.admin,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

type GetPublicationReturn = Publication & {
	CommentsList: (Comment & {
		User: User;
	})[];
	AuthoredUser: User;
};
export const GetPublicationRequest = async (id: number, admin?: boolean) => {
	return await axios
		.get<GetPublicationReturn>(`/api/news/${id}`, {
			params: {
				includeComments: true,
				includeHidden: admin,
				includeViolations: admin,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

type CreatePublicationParams = {
	title: string;
	content: string;
	tags: string[];
	hide: boolean;
};
type CreatePublicationReturn = Publication;
export const CreatePublicationRequest = async (token: string, params: CreatePublicationParams) => {
	return await axios
		.post<CreatePublicationReturn>(`/api/news`, params, {
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

type UpdatePublicationParams = {
	title?: string;
	content?: string;
	tags?: string[];
	hide?: boolean;
};
type UpdatePublicationReturn = Publication;
export const UpdatePublicationRequest = async (token: string, id: number, params: UpdatePublicationParams) => {
	return await axios
		.patch<UpdatePublicationReturn>(`/api/news/${id}`, params, {
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

export const DeletePublicationRequest = async (token: string, id: number) => {
	return await axios
		.delete<{ ok: boolean }>(`/api/news/${id}`, {
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

type SetCommentParams = {
	content: string;
	rate: number;
};
export const SetCommentRequest = async (token: string, id: number, params: SetCommentParams) => {
	return await axios
		.post<{ message: string; comment: Comment; user: User }>(`/api/news/${id}/comment`, params, {
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

export const DeleteCommentRequest = async (token: string, id: number) => {
	return await axios
		.delete<{ message: string; ok: boolean }>(`/api/news/${id}/comment`, {
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
