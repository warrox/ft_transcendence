import { FastifyReply, FastifyRequest } from 'fastify';
import db from '../../db';
import {User} from '../index'

// Route pour récupérer tous les utilisateurs (sans mot de passe)
export const users = async (_request: FastifyRequest, reply: FastifyReply) => {
	const rows = await new Promise((resolve, reject) => db.all('SELECT id, name, surname, email FROM users', [], (err, rows: Omit<User, 'password'>[]) => {
		if (err) {
			return reject();
		}
		return resolve(rows);
	}));
	
	return reply.send(rows);
};

export const checkJWT = async (request: FastifyRequest, reply: FastifyReply)=> {
	try {
		const token = request.cookies.token;
		if(!token){
			return reply.status(401).send({ error: 'token manquant'});
		}
		const decoded = request.server.jwt.verify(token);
		reply.status(401).send({valid : true,  payload :  decoded});
	}
	catch(err){
		reply.status(401).send({valid : false, error : " JWT invalide"});
	} 
};

//async function wawa (_param:string): void {
//	console.log("salope");
//}
//
//const wawa = (_param: string):void => {
//	console.log("salope");
//
//}
