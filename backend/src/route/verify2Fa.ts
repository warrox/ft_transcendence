import { User } from "../index";
import { FastifyReply, FastifyRequest } from "fastify";
import { twoFAStore } from "./login"
import { server } from "../index";
import db from '../../db';

export const verify2Fa = async(request: FastifyRequest <{ Body: User}>, reply: FastifyReply) => 
{
	const {code2FA, email, id} = request.body;
	console.log("twofa from front : ", code2FA);
	console.log("twofa from back: ", twoFAStore.code.toString());
	if(code2FA === twoFAStore.code.toString())
	{
		const token = server.jwt.sign({ id: id, email :email}, { expiresIn: 3600 });
		reply.setCookie("access_token", token, {
			path: "/",
			httpOnly: true,
			secure: true,
			maxAge: 3600,
		});
		return reply.status(200).send({ success: true, message: "2FA verified" });
		
		// return (reply.status(200)
		// .send({success: true, twoFA: false, message: "2FA code correct, successfully logged"}));
	}
	// if(twoFAStore[email] && twoFAStore[email].toString() === code2FA)
	// {
		
	// 	delete twoFAStore[request.body.email];
	// 	const token = server.jwt.sign({ id: id, email }, { expiresIn: 3600 });
	// 	reply.setCookie("access_token", token, {
	// 		path: "/",
	// 		httpOnly: true,
	// 		secure: true,
	// 		maxAge: 3600,
	// 	});
	// 	return reply.status(200).send({ success: true, message: "2FA verified" });
	// }
	else{
		return ( reply.status(401)
		.send(({error: "Wrong 2FA code"})));
	}
}  

