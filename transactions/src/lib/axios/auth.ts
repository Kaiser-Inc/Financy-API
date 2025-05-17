import { env } from "@/env";
import axios from "axios";

export const auth = axios.create({
	baseURL: env.AUTH_SERVICE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export async function verify(token: string) {
	const response = await auth.post(
		"/token/verify",
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);

	return response.data;
}
