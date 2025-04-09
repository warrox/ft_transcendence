import {server} from '../index'
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import db from '../../db';
import bcrypt from 'fastify-bcrypt';
import {User} from '../index'



// Route pour récupérer tous les utilisateurs (sans mot de passe)
export async function getRoute(server : FastifyInstance)
{
	server.get('/users', (_request: FastifyRequest, reply: FastifyReply) => {
		db.all('SELECT id, name, surname, email FROM users', [], (err, rows: Omit<User, 'password'>[]) => {
			if (err) {
				return reply.status(500).send({ error: 'Erreur lors de la récupération des utilisateurs' });
			}
			return reply.send(rows);
		});
	});
}

export async function checkJWT(server : FastifyInstance)
{
	server.get('/checkJWT', (request: FastifyRequest, reply: FastifyReply)=> {
		try {
		 const token = request.cookies.token;
			 if(!token){
				return reply.status(401).send({ error: 'token manquant'});
			}
			const decoded = server.jwt.verify(token);
			reply.status(401).send({valid : true,  payload :  decoded});
		}
		catch(err){
			reply.status(401).send({valid : false, error : " JWT invalide"});
		} 
	})
} 
