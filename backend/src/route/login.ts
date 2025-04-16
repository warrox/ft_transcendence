import { User } from "../index";
import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
import { server } from "../index";

export const login = async (request: FastifyRequest<{ Body: User }>,reply: FastifyReply) => {
	const { email, password } = request.body;

	if (!email || !password) {
		return reply.status(400).send({ error: "Email and password are required" });
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return reply.status(400).send({ error: "Invalid email format" });
	}

	try {
		const result = await new Promise<{code: number, message: string}>((resolve, reject) => {
			db.get<{ password: string }>(
				"SELECT password FROM users WHERE email = ?",
				[email],
				async (err, row) => {
					if (err)
						reject();
					if (!row)
						resolve({code: 401, message: "Invalid email or password" });
					try {
						const isMatch = await server.bcrypt.compare(password, row.password);
						if (isMatch) {
							console.log("Arreirerr !!!!");
							resolve({code: 200, message: "Login successful" });
						} else {
							console.log("Crotte");
							resolve({code: 401, message: "Invalid email or password" });
						}
					} catch (err) {
						console.error("Bcrypt error:", err);
						reject();
					}
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
	console.log("pffffffffff");
};
//if(!email || !password)
//	//  if yes go to 2 
//	// 2 decrypt password and compare with the one enter by user 
//	// if same log in 
//	// if not  send a reply 

