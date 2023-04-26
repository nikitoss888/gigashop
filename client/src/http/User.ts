import axios from "axios";

export type LoginResults = {
	message?: string;
	token: string;
};

export const LogInRequest = async (password: string, credentials: string) => {
	const api = process.env.REACT_APP_SERVER_URL || "http://localhost:5000/api";

	return await axios
		.post<LoginResults>(`${api}/user/login`, {
			credentials,
			password,
		})
		.catch((err) => {
			throw new Error(err.response.data);
		});
};
