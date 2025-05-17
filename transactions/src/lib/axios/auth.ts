import axios from "axios";

export const auth = axios.create({
	baseURL: "http://financy-auth:4013",
	headers: {
		"Content-Type": "application/json",
	},
});
