import { FastifyRequest, FastifyReply } from "fastify";
import {User} from '../index'

export const logout = async (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {

	reply.setCookie('access_token', "", {
		path: '/',
		httpOnly: true,
		secure: true,
		maxAge: 0
	});

	return reply.status(200).send({message: "DISCONNECT" });
};
