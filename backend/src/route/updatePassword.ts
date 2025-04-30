
import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";

export interface UpdatePasswordBody {
	userId: number;
	newpassword: string;
}

export const updatePassword = async (request: FastifyRequest<{ Body: UpdatePasswordBody }>, reply: FastifyReply) => {
	const { userId, newpassword } = request.body;

	try {

		const hashedPass = await request.server.bcrypt.hash(newpassword);
		const result = await new Promise((resolve, reject) => {
			db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPass, userId], function (err) {
				if (err) return reject(err);
				if (this.changes === 0) return reject(new Error("User not found"));
				resolve("Password updated");
			});
		});

		reply.code(200).send({ message: result });
	} catch (err: any) {
		reply.code(400).send({ error: err.message });
	}
};
