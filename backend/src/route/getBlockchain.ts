import { FastifyReply, FastifyRequest } from 'fastify';
const contract = require('../../blockchain/contractConfig');

type JWTClaims = {
	id: string,
	email: string,
};

export const getBlockchain = async (request : FastifyRequest, reply: FastifyReply) => {
	try{
		const token = request.cookies["access_token"];
		
		if(!token){
			return reply.status(401).send({error : 'Token manquant'});
		}
		const claims = request.server.jwt.decode<JWTClaims>(token);
		if(!claims || !claims.id){
			return reply.status(401).send({ error: 'Token invalide'})
		}
		console.log("YYYY");
		
		const score = await contract.getUserScores(BigInt(claims.id));

		console.log(score + "prout");
		
		return reply.status(200).send({ score });
		
		
	}catch(err) {
	console.error("Erreur dans getBlockchain:", err);
	return reply.status(500).send({ error: "Erreur serveur" });
	}
}



