import { FastifyReply, FastifyRequest} from "fastify";
import { me } from "./route/me";
import { users } from "./route/get";
import { checkJWT } from "./route/get";
import { User, GoogleTokenRequest } from ".";
import { register } from "./route/post"
import { login } from "./route/login"
import { gsignin } from "./route/gsignin"
import { glogin } from "./route/glogin"
import { post2Fa } from "./route/post2Fa";
export interface GetRoutes {
	me (request: FastifyRequest, reply: FastifyReply): any
	users (request: FastifyRequest, reply: FastifyReply): any
	checkJWT (request: FastifyRequest, reply: FastifyReply): any
	register (request: FastifyRequest<{ Body: User }>, reply: FastifyReply): Promise<undefined>
	login( request: FastifyRequest<{ Body : User }> , reply: FastifyReply) : any
	gsignin( request: FastifyRequest <{ Body : GoogleTokenRequest }>, reply: FastifyReply ) : any
	glogin( request: FastifyRequest <{ Body : GoogleTokenRequest }>, reply: FastifyReply ) : any
	post2Fa( request: FastifyRequest<{ Body : User }> , reply: FastifyReply) : any
}

export const getRoutes: GetRoutes = {
	me: me,
	users: users,
	checkJWT: checkJWT,
	register: register,
	login: login,
	gsignin: gsignin,
	glogin: glogin,
	post2Fa:post2Fa
};
