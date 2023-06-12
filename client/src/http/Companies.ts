import axios, { AxiosError } from "axios";
import { Item } from "./Items";

export type Company = {
	id: number;
	name: string;
	description: string;
	director: string;
	image: string;
	founded: string;
	hide: boolean;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
};

export type GetAllCompaniesParams = {
	name?: string;
	desc?: boolean;
	sortBy?: string;
	limit: number;
	page: number;
	hidden?: boolean;
};
type GetAllCompaniesReturn = {
	companies: Company[];
	totalCount: number;
};
export const GetAllCompaniesRequest = async (params: GetAllCompaniesParams) => {
	return await axios
		.get<GetAllCompaniesReturn>(`/api/shop/companies`, {
			params: params,
		})
		.then((res) => {
			return res.data;
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

export type GetCompanyReturn = Company & {
	ItemsDeveloped: Item[];
	ItemsPublished: Item[];
};
export const GetCompanyRequest = async (id: number, admin?: boolean) => {
	return await axios
		.get<GetCompanyReturn>(`/api/shop/companies/${id}`, {
			params: {
				includeDeveloped: true,
				includePublished: true,
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

type CreateCompanyParams = {
	name: string;
	description: string;
	director: string;
	image: string;
	founded: string;
	hide: boolean;
};
type CreateCompanyReturn = Company;
export const CreateCompanyRequest = async (token: string, params: CreateCompanyParams) => {
	return await axios
		.post<CreateCompanyReturn>(`/api/shop/companies`, params, {
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

type UpdateCompanyParams = {
	name?: string;
	description?: string;
	director?: string;
	image?: string;
	founded?: string;
	hide?: boolean;
};
type UpdateCompanyReturn = Company;
export const UpdateCompanyRequest = async (token: string, id: number, params: UpdateCompanyParams) => {
	return await axios
		.patch<UpdateCompanyReturn>(`/api/shop/companies/${id}`, params, {
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

export const DeleteCompanyRequest = async (token: string, id: number) => {
	return await axios
		.delete<{ ok: boolean }>(`/api/shop/companies/${id}`, {
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
