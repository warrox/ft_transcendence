import { User } from "../index";
import { FastifyReply, FastifyRequest } from "fastify";
import { twoFAStore } from "./login"

export const verify2Fa = async(request: FastifyRequest <{ Body: User}>, reply: FastifyReply) => 
{
	const {code2FA} = request.body;
	if(code2FA === twoFAStore.code.toString())
	{
		return (reply.status(200)
		.send({success: true, twoFA: false, message: "2FA code correct, successfully logged"}));
	}
	else{
		return ( reply.status(401)
		.send(({error: "Wrong 2FA code"})));
	}
}  

