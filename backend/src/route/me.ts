import { FastifyRequest, FastifyReply } from 'fastify';
import db from '../../db';

type JWTClaims = {
	id: string,
	email: string,
};

export const me = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const token = request.cookies["access_token"];
		if (!token) {
			return reply.status(401).send({ error: 'Token manquant' });
		}

		const claims = request.server.jwt.decode<JWTClaims>(token);
		const userId = claims!.id;
		console.log(userId);

		db.get('SELECT id, name, surname, email FROM users WHERE id = ?', [userId], (err, row) => {
			if (err) {
				return reply.status(500).send({ error: 'Erreur serveur' });
			}

			if (!row) {
				return reply.status(404).send({ error: 'Utilisateur non trouvé' });
			}

			return reply.send(row);
		});

	} catch (err) {
		return reply.status(401).send({ error: 'JWT invalide ou expiré' });
	}
}
