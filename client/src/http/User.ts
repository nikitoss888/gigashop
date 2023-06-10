// import axiosInstance from "./AxiosInstance";
import axios, { type AxiosError } from "axios";

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
		.post(`/api/user/register`, {
			email,
			login,
			firstName,
			lastName,
			password,
			image,
		})
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};

export type Profile = {
	id: number;
	login: string;
	email: string;
	firstName: string;
	lastName: string;
	image: string;
	role: string;
	isBlocked: boolean;
};
export const ProfileRequest = async (token: string) => {
	return await axios
		.get(`/api/user/profile`, {
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
		.catch((err: AxiosError) => {
			throw new Error(err.message);
		});
};
