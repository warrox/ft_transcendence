import { FastifyRequest, FastifyReply } from "fastify";
import db from "../../db";

export interface langBody {
	chosenLang: string;
}

type JWTClaims = {
	id: string,
	email: string,
};

export const postLang = async (request: FastifyRequest<{ Body: langBody }>, reply: FastifyReply) => {
	const { chosenLang } = request.body;

	if (!chosenLang) {
		return reply.status(400).send({ error: "Missing body" });
	}

	try {
		const token = request.cookies["access_token"];
		if (!token) {
			return reply.status(401).send({ error: "Token manquant" });
		}

		const claims = request.server.jwt.decode<JWTClaims>(token);
		const userId = claims!.id;

		await new Promise((resolve, reject) => {
			db.run(
				'UPDATE users SET lang = ? WHERE id = ?',
				[chosenLang, userId],
				function (err) {
					if (err) return reject(err);
					if (this.changes === 0) return reject(new Error("Utilisateur introuvable"));
					resolve(true);
				}
			);
		});

		return reply.status(200).send({ message: "Lang Update" });

	} catch (err: any) {
		console.error(err);
		return reply.status(500).send({ error: err.message || "Erreur serveur" });
	}
};
