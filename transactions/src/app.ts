import cookie from "@fastify/cookie";
import { fastify } from "fastify";
import { appRoutes } from "./http/routes/routes";
import authProxy from "./http/routes/auth-proxy";

export const app = fastify();

app.register(cookie);
app.register(authProxy);
app.register(appRoutes);
