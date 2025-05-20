import { FastifyReply, FastifyRequest } from 'fastify';
import {contract} from '../../blockchain/contractConfig'
type JWTClaims = {
	id: string,
	email: string,
};

export const getBlockchain = async (request : FastifyRequest, reply: FastifyReply) => {
	try{
		const token = request.cookies["access_token"];
		console.log(token);
		
		if(!token){
			return reply.status(401).send({error : 'Token manquant'});
		}
		const claims = request.server.jwt.decode<JWTClaims>(token);
		if(!claims || !claims.id){
			return reply.status(401).send({ error: 'Token invalide'})
		}
		const score = await contract.getUserScores(claims.id);
		return reply.status(200).send({ score });
		
		
	}catch(err){}
}



