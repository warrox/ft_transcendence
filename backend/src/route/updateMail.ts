import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";

export interface UpdateMailBody {
	userId: number;
	newMail: string;
}

export const updateMail = async (request: FastifyRequest<{ Body: UpdateMailBody }>, reply: FastifyReply) => {
	const { userId, newMail } = request.body;

	try {
		const result = await new Promise((resolve, reject) => {
			db.run('UPDATE users SET email = ? WHERE id = ?', [newMail, userId], function (err) {
				if (err) return reject(err);
				if (this.changes === 0) return reject(new Error("User not found"));
				resolve("Email updated");
			});
		});

		reply.code(200).send({ message: result });
	} catch (err: any) {
		reply.code(400).send({ error: err.message });
	}
};
