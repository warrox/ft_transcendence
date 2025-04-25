import { FastifyRequest, FastifyReply } from "fastify";
import { server } from "../index"
import db from '../../db';
import {User} from '../index'

export const logout = async (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
	const { email } = request.body;

	try {
		const userId = await new Promise<number>((resolve, reject) => {
			db.get('SELECT id FROM users WHERE email = ?', [email], (err, row: { id: number } | undefined) => {
				if (err) return reject(err);
				if (!row) return reject(new Error("Unfind user"));
				resolve(row.id);
			});
		});

		const token = server.jwt.sign({ id: userId, email }, { expiresIn: 0 });

		reply.setCookie('access_token', token, {
			path: '/',
			httpOnly: true,
			secure: true,
			maxAge: 0
		});

		return reply.status(200).send({ accessToken: token, message: "UNCONNECT" });
	} catch (e: any) {
		console.error(e);
		return reply.status(500).send({ error: "Erreur serveur : " + e.message });
	}
};
