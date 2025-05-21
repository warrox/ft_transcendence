import { FastifyReply, FastifyRequest } from 'fastify';
const contract = require('../../blockchain/contractConfig');

type JWTClaims = {
	id: string,
	email: string,
};


function bigIntToString(obj: any): any {
	if (typeof obj === 'bigint') {
		return obj.toString();
	} else if (Array.isArray(obj)) {
		return obj.map(bigIntToString);
	} else if (typeof obj === 'object' && obj !== null) {
		const newObj: any = {};
		for (const key in obj) {
			newObj[key] = bigIntToString(obj[key]);
		}
		return newObj;
	}
	return obj;
}

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
		const rawScore = await contract.getUserScores(BigInt(claims.id));
		const score = bigIntToString(rawScore);

		return reply.status(200).send({ score });
		
		
	}catch(err) {
	console.error("Erreur dans getBlockchain:", err);
	return reply.status(500).send({ error: "Erreur serveur" });
	}
}



