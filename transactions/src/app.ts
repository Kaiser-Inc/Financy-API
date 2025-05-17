import cookie from "@fastify/cookie";
import { fastify } from "fastify";
import { appRoutes } from "./http/routes/routes";

export const app = fastify();

app.register(cookie);
app.register(appRoutes);
