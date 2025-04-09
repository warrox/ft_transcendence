import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import db from '../db';
import bcrypt from 'fastify-bcrypt';
import { postRoute } from "./route/post";
export const server = fastify();

import dotenv from 'dotenv';
dotenv.config();
const JWS =  process.env.JWTSECRETKEY;
server.register(bcrypt, { saltWorkFactor: 12 });
//FIX: Import jwt dynamically from .env file
server.register(fjwt, { secret: JWS!});

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

export interface User {
  id?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
}
 postRoute(server); // check tout le shmilbique pour export cette merde 
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
