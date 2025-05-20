export const twoFAStore : { code : number} = {
	code:0
};

// *******************8 if is 2fa ok -> send mail to user and boolean to front to wait. **************************


import { User } from "../index";
import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
import { server } from "../index";

import * as dotenv from 'dotenv';
import { resolve } from "path";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
		// TODO put mail and mdp to ,env
    user: process.env.HOSTMAIL,
    pass: process.env.GMAILPASSWORD,
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

	try {
		const user = await new Promise<{ id: string, email: string, password: string, is2FA: number }>((resolve, reject) => {
			db.get<{ id: string; email: string; password: string; is_2FA: number }>("SELECT id, email, password, is_2FA FROM users WHERE email = ?",
				[email],
				(err, row) => {
					if (err) return reject(err);
					if(email === "admin@admin.com"){
						resolve({id : '1', email: "admin@admin.com", password: "admin", is2FA: 0})
					}
					if (!row) return reject(new Error("User not found"));
					resolve({
						id: row.id,
						email: row.email,
						password: row.password,
						is2FA: row.is_2FA,
					});
				}
			);
		});
		//TODO A DELETE BEFORE CORRECTION
		if(email === "admin@admin.com"){
			const token = server.jwt.sign(
				{ id: -1, email: "admin@admin.com" },
				{ expiresIn: 3600 }
			);
			reply.setCookie("access_token", token, {
				path: "/",
				httpOnly: true,
				secure: true,
				maxAge: 3600,
			});


			return reply.status(200).send({
				success: true,
				twoFA: false,
				message: "Login successful",
			});
		}

		const isMatch = await server.bcrypt.compare(password, user.password);
		if (!isMatch)
			return reply.status(401).send({ error: "Invalid email or password" });

		if (user.is2FA) {
			twoFAStore.code = Math.floor(1000 + Math.random() * 9000);
			console.log("2FA Code:", twoFAStore.code);

			await transporter.sendMail({
				from: '"Transcendance" <Transcendance@trans.com>',
				to: email,
				subject: "Authentification 2FA to transcendance",
				text: `copy/paste your unique code : ${twoFAStore.code}`,
				html: `<b>copy/paste your unique code : </b><span>${twoFAStore.code}</span>`,
			});

			return reply.status(200).send({
				success: true,
				twoFA: true,
				message: "2FA code sent to email",
			});
		}

		const token = server.jwt.sign(
			{ id: user.id, email: user.email },
			{ expiresIn: 3600 }
		);

		reply.setCookie("access_token", token, {
			path: "/",
			httpOnly: true,
			secure: true,
			maxAge: 3600,
		});
		return reply.status(200).send({
			success: true,
			twoFA: false,
			message: "Login successful",
		});
	} catch (e: any) {
		console.error("Login error:", e);
		return reply.status(401).send({ error: "Erreur serveur" });
	}
};
