import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import db from '../db';
//const cors = require('@fastify/cors');
//const db = require('./db.js');


const server = fastify();

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
server.post('/users', (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
  const { name, surname, email, password } = request.body;

  if (!name || !surname || !email || !password) {
    return reply.status(400).send({ error: "Tous les champs sont obligatoires" });
  }
	// ???? protege des sql injections.
  db.run(
    'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
    [name, surname, email, password],
    function (this: { lastID: number }, err: Error | null) {
      if (err) {
        reply.status(400).send({ error: 'Email déjà utilisé ou erreur SQL' });
      } else {
        reply.send({ id: this.lastID, name, surname, email });
      }
    }
  );
});

// Route pour récupérer tous les utilisateurs
server.get('/users', (request: FastifyRequest, reply: FastifyReply) => {
  db.all('SELECT * FROM users', [], (err: Error | null, rows: User[]) => {
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
