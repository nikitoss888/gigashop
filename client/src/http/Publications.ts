import { AxiosError } from "axios";
import { User } from "./User";
import axiosInstance from "./axiosInstance";

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
	createdFrom?: Date;
	createdTo?: Date;
	tags?: string[];
	authorsIds?: number[];
};
type GetAllPublicationsReturn = {
	publications: (Publication & {
		AuthoredUser: User;
	})[];
	totalCount: number;
};
export const GetAllPublicationsRequest = async (params: GetAllPublicationsParams) => {
	return await axiosInstance
		.get<GetAllPublicationsReturn>(`/news`, {
			params: {
				title: params.title,
				createdFrom: params.createdFrom?.toISOString(),
				createdTo: params.createdTo?.toISOString(),
				limit: params.limit,
				page: params.page,
				sortBy: params.sortBy,
				hidden: params.admin,
				desc: params.desc,
				tags: params.tags,
				authorsIds: params.authorsIds,
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
	return await axiosInstance
		.get<GetPublicationReturn>(`/news/${id}`, {
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
	return await axiosInstance
		.post<CreatePublicationReturn>(`/news`, params, {
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
	return await axiosInstance
		.patch<UpdatePublicationReturn>(`/news/${id}`, params, {
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
	return await axiosInstance
		.delete<{ ok: boolean }>(`/news/${id}`, {
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
	return await axiosInstance
		.post<{ message: string; comment: Comment; user: User }>(`/news/${id}/comment`, params, {
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
	return await axiosInstance
		.delete<{ message: string; ok: boolean }>(`/news/${id}/comment`, {
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
