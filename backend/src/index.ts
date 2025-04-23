import fastify, { FastifyInstance } from 'fastify';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import bcrypt from 'fastify-bcrypt';
import { getRoutes } from './GetRoutes.types';
import * as dotenv from 'dotenv';

//import type { Send } from 'nodemailer';
//import module from '../node_modules/nodemailer';

' use strict'

export const server = fastify();


/*695141578047-7bspgbrs2s2vobdb4lr5u74mcblk41e1.apps.googleusercontent.com*/
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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*'],
  credentials: true,
});


export interface User {
  id?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  code2FA?: string;
}

export interface GoogleTokenRequest {
	token: string;
}

async function registerRoutes(server: FastifyInstance): Promise<any> {

	server.get('/me', getRoutes.me);
	server.get('/users', getRoutes.users);
	server.get('/checkJWT', getRoutes.checkJWT);
	server.post('/register', getRoutes.register);
	server.post('/login', getRoutes.login);
	server.post('/gsignin', getRoutes.gsignin );
	server.post('/glogin', getRoutes.glogin); 
	server.post('/post2Fa', getRoutes.post2Fa);
	//checkJWT(server);
	//postRoute(server); // check tout le shmilbique pour export cette merde 
	//getRoute(server); // get 
}

registerRoutes(server);


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
