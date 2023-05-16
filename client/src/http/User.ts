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
