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
export const gsignin = async(request : FastifyRequest<{Body : GoogleTokenRequest} >, reply : FastifyReply) => {
	// Step 1 stock call from google api 

	const { token } = request.body;


	const decoded = server.jwt.decode(token) as GoogleDecodedToken;
	console.log(decoded.name);
	let is_gUser = 0;
	try{
		const user = await new Promise <any>((resolve, reject )=>{	
			db.get('SELECT id, is_googleUser FROM users WHERE email = ?', [decoded.email], (err, row) => {
				if(err) return reject;
				resolve(row);
			});
		});
		is_gUser = user.is_googleUser;

		if(user && is_gUser === 0){
			return reply.status(409).send({ error: "Cet email est déjà utilisé, veuillez vous connectez sans Google" });
		}
		
		//USER N'EXISTE PAS, CREER ET LOG
		if (!user){
			const userId = await new Promise<number>((resolve, reject) => {
				const test = db.run(
					'INSERT INTO users (name, surname, email, password, is_googleUser) VALUES (?, ?, ?, ?, ?)',
					[decoded.given_name, decoded.family_name, decoded.email, "wtZSAGd9B*#p&p3", 1],
					function (err: Error | null) {
						if (err) return reject(new Error("Erreur lors de l'insertion de l'utilisateur"));
						resolve(this.lastID);
					}
				);
				console.log(test);
			});

			const token = server.jwt.sign({ id: userId, email: decoded.email}, {expiresIn: 36000 }); 
			reply.setCookie('access_token', token, {
				path: '/',
				httpOnly: true,
				secure: true,
				maxAge: 36000
			});
			return reply.status(201).send({ accessToken: token, message: "Utilisateur créé avec succès" });
		}
		///////////////////////////////////////////////////////////
		

		//USER EXISTE DEJA, LOG SEULEMENT
		console.log("User:", user);
		console.log("Email:", decoded.email);
		const token = server.jwt.sign({ id: user.id, email: decoded.email}, {expiresIn: 36000 });
		reply.setCookie('access_token', token, {
			path: '/',
			httpOnly: true,
			secure: true,
			maxAge: 36000
		});
		return reply.status(200).send({ accessToken: token, message: "Utilisateur connecte avec succès" });
	} catch (e: any) {
		console.error(e);
		return reply.status(500).send({ error: "Erreur serveur" });
	}
}

