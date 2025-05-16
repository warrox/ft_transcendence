import { FastifyRequest, FastifyReply } from 'fastify';
import db from '../../db';

type JWTClaims = {
	id: string,
	email: string,
};

const dbAll = (sql: string, params: any[]) => {
	return new Promise<any[]>((resolve, reject) => {
		db.all(sql, params, (err, rows) => {
			if (err) return reject(err);
			resolve(rows);
		});
	});
};


export const getGameScore = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const token = request.cookies["access_token"];
		if (!token) {
			return reply.status(401).send({ error: 'Token manquant' });
		}

		const claims = request.server.jwt.decode<JWTClaims>(token);
		const userId = claims!.id;

		const rows = await dbAll(
			'SELECT id, user_id, result, guest_name, game_date, score FROM games WHERE user_id = ? ORDER BY game_date DESC',
			[userId]
		);

		if (!rows || rows.length === 0) {
			return reply.status(404).send({ error: 'Aucune partie trouvée' });
		}

		return reply.status(200).send(rows);

	} catch (err) {
		console.error(err);
		return reply.status(401).send({ error: 'JWT invalide, expiré ou erreur serveur' });
	}
};

// import { FastifyRequest, FastifyReply } from 'fastify';
// import db from '../../db';

// type JWTClaims = {
// 	id: string,
// 	email: string,
// };

// const dbGet = (sql: string, params: any[]) => {
// 	return new Promise<any>((resolve, reject) => {
// 		db.get(sql, params, (err, row) => {
// 			if (err) return reject(err);
// 			resolve(row);
// 		});
// 	});
// };

// export const getGameScore = async (request: FastifyRequest, reply: FastifyReply) => {
// 	try {
// 		const token = request.cookies["access_token"];
// 		if (!token) {
// 			return reply.status(401).send({ error: 'Token manquant' });
// 		}

// 		const claims = request.server.jwt.decode<JWTClaims>(token);
// 		const userId = claims!.id;

// 		const row = await dbGet(
// 			'SELECT id, user_id , result , guest_name , game_date FROM games WHERE id = ? ORDER BY game_date',
// 			[userId]
// 		);

// 		if (!row) {
// 			return reply.status(404).send({ error: 'Utilisateur non trouvé' });
// 		}

// 		return reply.status(200).send(row);

// 	} catch (err) {
// 		console.error(err);
// 		return reply.status(401).send({ error: 'JWT invalide, expiré ou erreur serveur' });
// 	}
// };