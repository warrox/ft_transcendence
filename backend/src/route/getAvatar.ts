
import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
import path from 'path';
import fs from 'fs'
type JWTClaims = {
	id: string,
	email: string,
};

export const getAvatar = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const token = request.cookies["access_token"];
		if (!token) {
			return reply.status(401).send({ error: 'Token manquant' });
		}

		const claims = request.server.jwt.decode<JWTClaims>(token);
		if (!claims || !claims.id) {
			return reply.status(401).send({ error: 'Token invalide' });
		}

		const avatarPath = await new Promise<string>((resolve : any, reject) => {
			db.get('SELECT avatar_path FROM users WHERE id = ?', [claims.id], function ( err, row: { avatar_path: string } | undefined) {
				if (err) return reject(err);
				if (!row) return reject(new Error("Utilisateur non trouvé"));
				console.log(row);
				const full_path = path.join(__dirname, row.avatar_path);
				if (!fs.existsSync(full_path)) {
					return reply.code(404).send('Image not found')
				}
				
				resolve(fs.createReadStream(full_path));
				
			});
		});

		reply.send({ avatar: avatarPath });

	} catch (err) {
		console.error(err);
		reply.status(500).send({ error: 'Erreur serveur' });
	}
};
