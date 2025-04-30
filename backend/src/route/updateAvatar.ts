
import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
import fs from 'fs'
import path from 'path';

interface UpdateMailBody {
	userId: number;
	avatarpath: string;
}

export const updateAvatar = async (request: FastifyRequest<{ Body: UpdateMailBody }>, reply: FastifyReply) => {
	const { userId, avatarpath } = request.body;
	const files = await request.file();
	if (!files || !userId) {
		return reply.status(400).send({ error: "Missing file or userId" });
  }

	const filename = `avatar-user-${userId}-${Date.now()}-${files.filename}`;
	const uploadPath = path.join(__dirname, '../../public/uploads', filename);

	const stream = fs.createWriteStream(uploadPath);
	await files.file.pipe(stream);
	const relativePath = `/uploads/${filename}`;
	try {
		const result = await new Promise((resolve, reject) => {
			db.run('UPDATE users SET avatar_path = ? WHERE id = ?', [relativePath, userId], function (err) {
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
