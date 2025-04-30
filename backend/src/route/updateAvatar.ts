
import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";


interface UpdateMailBody {
	userId: number;
	avatarpath: string;
}

export const updateMail = async (request: FastifyRequest<{ Body: UpdateMailBody }>, reply: FastifyReply) => {
	const { userId, avatarpath } = request.body;
	const files = await request.savedRequestFiles();
	files[0].filepath = "../../public";

	try {
		const result = await new Promise((resolve, reject) => {
			db.run('UPDATE users SET avatar_path = ? WHERE id = ?', [avatarpath, userId], function (err) {
				if (err) return reject(err);
				if (this.changes === 0) return reject(new Error("User not found"));
				resolve("Avatar updated");
			});
		});

		reply.code(200).send({ message: result });
	} catch (err: any) {
		reply.code(400).send({ error: err.message });
	}
};
