
// *******************8 if is 2fa ok -> send mail to user and boolean to front to wait. **************************


import { User } from "../index";
import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
import { server } from "../index";
import { log } from "console";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
		// TODO put mail and mdp to ,env
    user: "warren.hamdi@gmail.com",
    pass: "fdvk omxq myyi ilqt",
  },
});

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

	let is2FA: number = 0;
	try {
		is2FA = await new Promise<number>((resolve, reject) => {
			db.get<{ check2FA: number }>(
				"SELECT is_2FA as check2FA FROM users WHERE email = ?",
				[email],
				(err, row) => {
					if (err) {
						console.error("DB error:", err);
						return reject(err);
					}
					if (!row) return reject(new Error("User not found"));
					resolve(row.check2FA === 1 ? 1 : 0);
					
				}
			);
			console.log(is2FA);
			
			
		});
	} catch (e: any) {
		console.warn("No 2FA found or user not found:", e.message);
	}

	try {
		const result = await new Promise<{ code: number; message: string }>(
			(resolve, reject) => {
				db.get<{ password: string, admin: number }>(
					"SELECT password,admin FROM users WHERE email = ?",
					[email],
					async (err, row) => {
						if (err) return reject(err);
						if (!row)
							return resolve({
								code: 401,
								message: "Invalid email or password",
							});

						try {
							console.warn("Pass: ", password, "Got:", row.password, "Admin ?: ", row.admin);
							if (row.admin == 1 && password == row.password)
								resolve({code: 200, message: "Welcome home comrad"});
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

		if (result.code === 200 && is2FA) {
			// TODO: envoyer code MAIL ICI 
			let r =  Math.floor(1000 + Math.random() * 9000) ;
			async function send_2FA() {
				// generate a random 
				console.log(r);
				// send mail with defined transport object
				const info = await transporter.sendMail({
					from: '"Transcendance" <Transcendance@trans.com>', // sender address
					to: email, // list of receivers
					subject: "Authentification 2FA to transcendance", // Subject line
					text: "copy/paste your unique code : " + r.toString(), // plain text body
					html: "<b>copy/paste your unique code : </b>", // html body
				});

				console.log("Message sent: %s", info.messageId);
				// Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
			}
			send_2FA().catch(console.error);
			if(request.body.code2FA === r.toString()){
				return (reply.status(200)
				.send({success: true, twoFA: false, message: "2FA code correct, successfully logged"}));
			}
			else{
				return ( reply.status(401)
				.send(({error: "Wrong 2FA code"})));
			}
		}


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
