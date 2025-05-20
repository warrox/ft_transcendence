import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";

export interface UpdateMailBody {
	email: string;
	newMail: string;
}

export const updateMail = async (request: FastifyRequest<{ Body: UpdateMailBody }>, reply: FastifyReply) => {
	const { email, newMail } = request.body;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return reply.status(400).send({ error: "Invalid email format" });
	}
	if (!emailRegex.test(newMail)) {
		return reply.status(400).send({ error: "New email format is invalid" });
	}
	try {
		const result = await new Promise((resolve, reject) => {
			db.run('UPDATE users SET email = ? WHERE email = ?', [newMail, email], function (err) {
				if (err) return reject(err);
				if (this.changes === 0) return reject(new Error("User not found"));
				resolve("Email updated");
			});
		});

		reply.code(200).send({ success: true, message: result });
	} catch (err: any) {
		reply.code(400).send({ error: err.message });
	}
};
