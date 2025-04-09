import {server} from '../index'
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import db from '../../db';
import bcrypt from 'fastify-bcrypt';
import {User} from '../index'
// Route pour ajouter un utilisateur

export async function postRoute(server : FastifyInstance)
{
	server.post('/register', async (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
		const { name, surname, email, password } = request.body;

		if (!name || !surname || !email || !password) {
			return reply.status(400).send({ error: "Tous les champs sont obligatoires" });
		}

		try {
			// Vérifier si l'utilisateur existe déjà
			const userExists = await new Promise<boolean>((resolve, reject) => {
				db.get('SELECT email FROM users WHERE email = ?', [email], (err, row) => {
					if (err) return reject(err);
					resolve(!!row);
				});
			});

			if (userExists) {
				return reply.status(409).send({ error: "Cet email est déjà utilisé" });
			}

			const hashedPass = await server.bcrypt.hash(password);

			const userId = await new Promise<number>((resolve, reject) => {
				db.run(
					'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
					[name, surname, email, hashedPass],
					function (err: Error | null) {
						if (err) return reject(new Error("Erreur lors de l'insertion de l'utilisateur"));
						resolve(this.lastID); // Récupérer l'ID de l'utilisateur ajouté
					}
				);
			});

			const token = server.jwt.sign({ id: userId, email: email}, {expiresIn: 3600 }); 
			reply.setCookie('access_token', token, {
				path: '/',
				httpOnly: true,
				secure: true,
				maxAge: 3600
			});

			return reply.status(201).send({ accessToken: token, message: "Utilisateur créé avec succès" });
		} catch (e: any) {
			console.error(e);
			return reply.status(500).send({ error: "Erreur serveur" });
		}
	});
}

