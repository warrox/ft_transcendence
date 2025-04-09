import {server} from '../index'
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import db from '../../db';
import bcrypt from 'fastify-bcrypt';
import {User} from '../index'

type JWTClaims = {
	id: string,
	email: string,
};

export async function getMe(server: FastifyInstance) {
	server.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const token = request.cookies["access_token"];

			if (!token) {
				return reply.status(401).send({ error: 'Token manquant' });
			}

			const claims = server.jwt.decode<JWTClaims>(token);
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
	});
}
