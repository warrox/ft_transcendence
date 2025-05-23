import {server} from '../index'
import { FastifyReply, FastifyRequest } from 'fastify';
import db from '../../db';
import {User} from '../index'

export const register = async (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
	const { name, surname, email, password } = request.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	  if (!emailRegex.test(email)) {
		return reply.status(400).send({ error: "Invalid email format" });
	  }
	if (!name || !surname || !email || !password) {
		return reply.status(400).send({ error: "Tous les champs sont obligatoires" });
	}

	try {
		const userExists = await new Promise<boolean>((resolve, reject) => {
			db.get('SELECT email FROM users WHERE email = ?', [email], (err, row) => {
				if (err) return reject(err);
				resolve(!!row);
			});
		});

		if (userExists) {
			return reply.status(409).send({ error: "Cet email est déjà utilise" });
		}

		const hashedPass = await request.server.bcrypt.hash(password);

		const userId = await new Promise<number>((resolve, reject) => {
			const test = db.run(
				'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
				[name, surname, email, hashedPass],
				function (err: Error | null) {
					if (err) return reject(new Error("Erreur lors de l'insertion de l'utilisateur"));
					resolve(this.lastID);
				}
			);
			console.log(test);
			
		});
		return reply.status(201).send({ message: "Utilisateur créé avec succès" });
	} catch (e: any) {
		console.error(e);
		return reply.status(500).send({ error: "Erreur serveur" });
	}
};
