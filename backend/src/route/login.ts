
// *******************8 if is 2fa ok -> send mail to user and boolean to front to wait. **************************


import { User } from "../index";
import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
import { server } from "../index";

export const login = async (
	request: FastifyRequest<{ Body: User }>,
	reply: FastifyReply
) => {
	const { email, password } = request.body;

	if (!email || !password) {
		return reply.status(400).send({ error: "Email and password are required" });
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return reply.status(400).send({ error: "Invalid email format" });
	}

	let is2FA = false;
	try {
		is2FA = await new Promise<boolean>((resolve, reject) => {
			db.get<{ check2FA: string }>(
				"SELECT is_2FA as check2FA FROM users WHERE email = ?",
				[email],
				(err, row) => {
					if (err) {
						console.error("DB error:", err);
						return reject(err);
					}
					if (!row) return reject(new Error("User not found"));
					resolve(row.check2FA === "true" || row.check2FA === "1");
				}
			);
		});
	} catch (e: any) {
		console.warn("No 2FA found or user not found:", e.message);
	}

	try {
		const result = await new Promise<{ code: number; message: string }>(
			(resolve, reject) => {
				db.get<{ password: string }>(
					"SELECT password FROM users WHERE email = ?",
					[email],
					async (err, row) => {
						if (err) return reject(err);
						if (!row)
							return resolve({
								code: 401,
								message: "Invalid email or password",
							});

						try {
							const isMatch = await server.bcrypt.compare(
								password,
								row.password
							);
							if (isMatch) {
								resolve({ code: 200, message: "Login successful" });
							} else {
								resolve({
									code: 401,
									message: "Invalid email or password",
								});
							}
						} catch (err) {
							console.error("Bcrypt error:", err);
							reject(err);
						}
					}
				);
			}
		);

		//if (result.code === 200 && is2FA) {
		//	// TODO: envoyer code MAIL ICI 
		//	try {
		//		await server.mailer.sendMail({
		//			to: email,
		//			subject: '2FA check for transcandence',
		//			text : 'The 2FA code is : random number'
		//		});
		//	}catch(e:any){
		//
		//	}
		//	return reply.status(200).send({
		//		success: true,
		//		twoFA: true,
		//		message: "2FA activated, check your email",
		//	});
		//}

		switch (result.code) {
			case 200:
				return reply
					.status(200)
					.send({ success: true, twoFA: false, message: result.message });
			case 401:
				return reply.status(401).send({ error: result.message });
		}
	} catch (e: any) {
		console.error("Login error:", e);
		return reply.status(500).send({ error: "Erreur serveur" });
	}
};
