import { FastifyRequest, FastifyReply } from 'fastify';
import db from '../../db';

type JWTClaims = {
	id: string,
	email: string,
};

const dbGet = (sql: string, params: any[]) => {
	return new Promise<any>((resolve, reject) => {
		db.get(sql, params, (err, row) => {
			if (err) return reject(err);
			resolve(row);
		});
	});
};

export const me = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const token = request.cookies["access_token"];
		if (!token) {
			return reply.status(401).send({ error: 'Token manquant' });
		}
		const claims = await request.server.jwt.verify<JWTClaims>(token);
		const userId = claims.id;

		const row = await dbGet(
			'SELECT id, is_2FA, name, surname, email, avatar_path, win ,loose, online FROM users WHERE id = ?',
			[userId]
		);
		// const gameInfo = await dbGet(
		// 	'SELECT id, result, guest_name, game_date FROM games WHERE id = ?',
		// 	[userId]
		// );

		if (!row) {
			return reply.status(404).send({ error: 'Utilisateur non trouvé' });
		}
		// if(gameInfo){
		// 	const result = {
		// 		row ,
		// 		gameInfo
		// 	};
		// 	return reply.status(200).send(result);
		// }
		return reply.status(200).send(row);

	} catch (err) {
		console.error("Erreur JWT ou DB :", err);
		return reply.status(401).send({ error: 'JWT invalide, expiré ou erreur serveur' });
	}
};

