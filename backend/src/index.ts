import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import db from '../db';
import bcrypt from 'fastify-bcrypt';
const { serialize, parse } = require('@fastify/cookie')

const server = fastify();

server.register(bcrypt, { saltWorkFactor: 12 });
//FIX: Import jwt dynamically from .env file
server.register(fjwt, { secret: '0VV6IaYsjVMlIl_e2kmcZsjllzIEjZSolCiPSoGPfY0sJhQtJKarviIMyWACuBvP_zRRA5bsIiM69HYgKZbifA'});

server.register(fCookie, {
  secret: 'some-secret-key',
  hook: 'preHandler',
});

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

interface User {
  id?: number;
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

    const token = server.jwt.sign({ id: userId, email}, {expiresIn: 3600 }); 
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

// Route pour récupérer tous les utilisateurs (sans mot de passe)
server.get('/users', (_request: FastifyRequest, reply: FastifyReply) => {
  db.all('SELECT id, name, surname, email FROM users', [], (err, rows: Omit<User, 'password'>[]) => {
    if (err) {
      return reply.status(500).send({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
    return reply.send(rows);
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

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, async () => {
    await server.close();
    process.exit(0);
  });
});
