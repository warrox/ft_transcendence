import fastify, { FastifyInstance } from 'fastify';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import bcrypt from 'fastify-bcrypt';
import { getRoutes } from './GetRoutes.types';
import * as dotenv from 'dotenv';
import multipart from '@fastify/multipart';
import fastifyWebsocket from '@fastify/websocket';

//import type { Send } from 'nodemailer';
//import module from '../node_modules/nodemailer';
import path from 'path';
import fastifyStatic from '@fastify/static';

import db from "../db";

'use strict'


export const server = fastify();

server.register(multipart);
/*695141578047-7bspgbrs2s2vobdb4lr5u74mcblk41e1.aipps.googleusercontent.com*/
dotenv.config();
const JWS = process.env.JWTSECRETKEY;

server.register(bcrypt, { saltWorkFactor: 12 });
server.register(fjwt, { secret: JWS! });
server.register(fCookie, {
	secret: process.env.SECRETCOOKIE,
	hook: 'preHandler',
});

server.register(cors, {
  origin: "https://localhost:3020", 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
});

server.register(fastifyStatic, {
	root: path.join(__dirname, '..', 'public', 'uploads'),
	prefix: '/uploads/', // correspond à l'URL publique
});


export interface User {
	id?: number;
	name: string;
	surname: string;
	email: string;
	password: string;
	code2FA?: string;
}

export interface Code2FARequestBody {
	email: string;
	code2FA: string;
}

export interface GoogleTokenRequest {
	token: string;
}

type JWTClaims = {
	id: string,
	email: string,
}

async function updateOnlineStatus(id: number, status: number) {
	db.run('UPDATE users SET online = ? WHERE id = ?', [status, id], (err) => {
		if (err) {
			console.error("Failed to update online status for user", id, err);
		}
	});
}

async function startupRoutine(server: FastifyInstance): Promise<any> {
	await server.register(fastifyWebsocket);

	server.get('/ws', { websocket: true }, (socket, req) => {
		const token = req.cookies?.["access_token"];
		if (!token) {
			console.error("Connection refused: no access token");
			socket.close();
			return;
		}

		let claims: JWTClaims;
		try {
			claims = server.jwt.decode<JWTClaims>(token) as JWTClaims;
		} catch (err) {
			console.error("Invalid JWT:", err);
			socket.close();
			return;
		}

		const userId = parseInt(claims.id);
		if (isNaN(userId)) {
			console.error("Invalid user ID in JWT");
			socket.close();
			return;
		}

		// Inform others that this user is online
		for (const client of server.websocketServer.clients) {
			if (client !== socket && client.readyState === 1) {
				client.send(JSON.stringify({ type: "friend_status", payload: { userId, online: true } }));
			}
		}

		updateOnlineStatus(userId, 1);
		console.log(`User ${userId} connected via WebSocket`);

		socket.on('close', () => {
			updateOnlineStatus(userId, 0);
			console.log(`User ${userId} disconnected`);

			for (const client of server.websocketServer.clients) {
				if (client.readyState === 1) {
					client.send(JSON.stringify({ type: "friend_status", payload: { userId, online: false } }));
				}
			}
		});
	});

	server.get('/me', getRoutes.me);
	server.get('/users', getRoutes.users);
	server.get('/checkJWT', getRoutes.checkJWT);
	server.post('/register', getRoutes.register);
	server.post('/login', getRoutes.login);
	server.post('/gsignin', getRoutes.gsignin);
	server.post('/glogin', getRoutes.glogin);
	server.post('/post2Fa', getRoutes.post2Fa);
	server.post('/verify2Fa', getRoutes.verify2Fa);
	server.get('/logout', getRoutes.logout);
	server.post('/updatePassword', getRoutes.updatePassword);
	server.post('/updateMail', getRoutes.updateMail);
	server.post('/updateAvatar', getRoutes.updateAvatar);
	server.post('/updateWinLoose', getRoutes.updateWinLoose);
	server.post('/postGameScore', getRoutes.postGameScore);
	server.post('/postLang', getRoutes.postLang);
	server.get('/getFriends', getRoutes.getFriends);
	server.get('/getAvatar', getRoutes.getAvatar);
	server.post('/friends', getRoutes.friends);
	server.get('/getGameScore', getRoutes.getGameScore);
	server.get('/getBlockchain', getRoutes.getBlockchain);
	//checkJWT(server);
	//postRoute(server); // check tout le shmilbique pour export cette merde 
	//getRoute(server); // get 

	server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(`Serveur démarré sur ${address}`);
	});
}

startupRoutine(server);


// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach((signal) => {
	process.on(signal, async () => {
		await server.close();
		process.exit(0);
	});
});
