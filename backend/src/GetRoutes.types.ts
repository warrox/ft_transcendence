import { FastifyReply, FastifyRequest} from "fastify";
import { me } from "./route/me";
import { users } from "./route/get";
import { checkJWT } from "./route/get";
import { User } from ".";
import { register } from "./route/post"

export interface GetRoutes {
	me (request: FastifyRequest, reply: FastifyReply): any
	users (request: FastifyRequest, reply: FastifyReply): any
	checkJWT (request: FastifyRequest, reply: FastifyReply): any
	register (request: FastifyRequest<{ Body: User }>, reply: FastifyReply): Promise<undefined>
}

export const getRoutes: GetRoutes = {
	me: me,
	users: users,
	checkJWT: checkJWT,
	register: register,
};
