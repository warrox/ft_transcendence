import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import db from '../db';
import bcrypt from 'fastify-bcrypt';

const server = fastify();

// Enregistrement du plugin bcrypt
server.register(bcrypt, {
  saltWorkFactor: 12
});

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Interface pour typer les données de l'utilisateur
interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
}

// Route pour ajouter un utilisateur
server.post('/users', async (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
  const { name, surname, email, password } = request.body;


  if (!name || !surname || !email || !password) {
    return reply.status(400).send({ error: "Tous les champs sont obligatoires" });
  }

	const hashedPass = await server.bcrypt.hash(password);

	try {
		await new Promise<void>((resolve, reject) => {
			db.run('INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
				[name, surname, email, hashedPass], // Utilisation du mot de passe hashé
				(err: Error | null) => {
					if (err) {
						return reject(new Error("Email déjà utilisé ou erreur SQL"));
					}
					return resolve();
				}
			)
		});
		return reply.status(200).send("User successfully created");
	} catch (e: any) {
		console.log(e);
		return reply.status(401).send(e);
	}

});

// Route pour récupérer tous les utilisateurs (sans mot de passe)
server.get('/users', (request: FastifyRequest, reply: FastifyReply) => {
  db.all('SELECT id, name, surname, email FROM users', [], (err: Error | null, rows: Omit<User, 'password'>[]) => {
    if (err) {
      reply.status(500).send({ error: 'Erreur lors de la récupération des utilisateurs' });
    } else {
      reply.send(rows);
    }
  });
});

// Démarrer le serveur
server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Serveur démarré sur ${address}`);
});
