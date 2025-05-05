import { FastifyReply, FastifyRequest } from 'fastify';
import db from '../../db';

type JWTClaims = {
	id: string,
	email: string,
};

interface FriendsBody {
	action: "add" | "del";
	emailClient: string;
	friendsId: number;
}

const friends = async (
	request: FastifyRequest<{ Body: FriendsBody }>,
	reply: FastifyReply
) => {
	const { action, friendsId } = request.body;

	try {
		const token = request.cookies["access_token"];
		if (!token) {
			return reply.status(401).send({ error: "Token manquant" });
		}

		const claims = request.server.jwt.decode<JWTClaims>(token);
		if (!claims) {
			return reply.status(403).send({ error: "Token invalide" });
		}

		const userId = parseInt(claims.id);

		if (action === "add") {
			const query = `INSERT INTO friends (user_id, friend_id, is_online) VALUES (?, ?, 0)`;
			await new Promise((resolve, reject) => {
				db.run(query, [userId, friendsId], function (err) {
					if (err) {
						if (err.message.includes("UNIQUE")) {
							return reject(new Error("Friend already added"));
						}
						return reject(err);
					}
					resolve(true);
				});
			});
			return reply.send({ message: "Ami ajouté avec succès" });
		}

		if (action === "del") {
			const query = `DELETE FROM friends WHERE user_id = ? AND friend_id = ?`;
			await new Promise((resolve, reject) => {
				db.run(query, [userId, friendsId], function (err) {
					if (err) return reject(err);
					if (this.changes === 0) return reject(new Error("Friend not found"));
					resolve(true);
				});
			});
			return reply.send({ message: "Friend deleted" });
		}

		return reply.status(400).send({ error: "Action invalide" });

	} catch (err: any) {
		console.error(err);
		return reply.status(500).send({ message: err.message || "Erreur serveur" });
	}
};

export default friends;

