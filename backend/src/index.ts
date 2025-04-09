import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import db from '../db';
import bcrypt from 'fastify-bcrypt';
import { postRoute } from "./route/post";
export const server = fastify();

import dotenv from 'dotenv';
import { checkJWT, getRoute } from './route/get';
dotenv.config();
const JWS =  process.env.JWTSECRETKEY;
server.register(bcrypt, { saltWorkFactor: 12 });
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
 checkJWT(server);
 getRoute(server); // get 
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
