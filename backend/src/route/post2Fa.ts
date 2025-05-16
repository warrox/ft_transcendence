import { FastifyReply, FastifyRequest } from 'fastify';
import db from '../../db';
import {User} from '../index'

type JWTClaims = {
	id: string,
	email: string,
};
export type twoFaBody = {
	is_2Fa: number;
}

export const post2Fa = async (request: FastifyRequest<{Body : twoFaBody}>, reply: FastifyReply) => {
	try {
		const token = request.cookies["access_token"];
		if (!token) {
			return reply.status(401).send({ error: 'Token manquant' });
		}

		const claims = request.server.jwt.decode<JWTClaims>(token);
		const userId = claims!.id;
		const {is_2Fa} = request.body;
		console.log("is_2fa", is_2Fa);

		db.run(
			"UPDATE users SET is_2FA = ? WHERE id = ?",
			[is_2Fa, userId],
			(err: any) => {
				if (err) {
					console.error(err);
					return reply.status(500).send({ error: "Erreur lors de l'update" });
				}
				return reply.send({ code: 200, message: "2FA activé avec succès" });
			}
		);
	} catch (err) {
		console.error(err);
		return reply.status(401).send({ error: 'JWT invalide, expiré ou erreur serveur' });
	}
};