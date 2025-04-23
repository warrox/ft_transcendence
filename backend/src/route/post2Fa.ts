import { FastifyReply, FastifyRequest } from 'fastify';
import db from '../../db';
import {User} from '../index'

type JWTClaims = {
	id: string,
	email: string,
};


export const post2Fa = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const token = request.cookies["access_token"];
		if (!token) {
			return reply.status(401).send({ error: 'Token manquant' });
		}

		const claims = request.server.jwt.decode<JWTClaims>(token);
		const userId = claims!.id;
		db.run(
				"UPDATE users SET is_2FA = 1 WHERE id = ?",
				[userId],
				(err) => {
					if (err) return;
					return({ code: 200, message: "2FA active avec succes" });
				}
			);	
	} catch (err) {
		console.error(err);
		return reply.status(401).send({ error: 'JWT invalide, expire ou erreur serveur' });
	}
};
