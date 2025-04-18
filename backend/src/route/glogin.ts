import { GoogleTokenRequest, server} from "../index";
import { FastifyReply, FastifyRequest } from "fastify";
import { register} from "./post"
import db from "../../db";
import { decode } from "punycode";
//import { server } from "../index";
interface GoogleDecodedToken {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  sub: string;
}
export const glogin = async(request : FastifyRequest<{Body : GoogleTokenRequest} >, reply : FastifyReply) => {
	// Step 1 stock call from google api 
	
	const { token } = request.body;

	console.log(token);
	
	const decoded = server.jwt.decode(token) as GoogleDecodedToken;
	console.log(decoded.name);

	try {
		const result = await new Promise<{code: number, message: string}>((resolve, reject) => {
			db.get<{ password: string }>(
				"SELECT email FROM users WHERE email = ?",
				[decoded.email],
				async (err, row) => {
					if (err)
						reject();
					if (!row)
						resolve({code: 401, message: "Invalid email" });
					resolve({code: 200, message: "Login successful" });
				}
			);
		});

		switch(result.code) {
			case 200: return reply.status(200).send({success: true, message: result.message});
			case 401: return reply.status(401).send({error: result.message});
		}
	} catch (e: any) {
		return reply.status(500).send({ error: "Erreur serveur"});
	}

		
}

