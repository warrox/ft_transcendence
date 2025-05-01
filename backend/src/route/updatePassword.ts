
import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
import { log } from "console";

export interface UpdatePasswordBody {
	email: string;
	newpassword: string;
}

export const updatePassword = async (request: FastifyRequest<{ Body: UpdatePasswordBody }>, reply: FastifyReply) => {
	const { email, newpassword } = request.body;
	log(request.body);
    console.log(email);

    console.log(newpassword);

	try {

		const hashedPass = await request.server.bcrypt.hash(newpassword);
		const result = await new Promise((resolve, reject) => {
			db.run('UPDATE users SET password = ? WHERE email = ?', [hashedPass, email], function (err) {
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
