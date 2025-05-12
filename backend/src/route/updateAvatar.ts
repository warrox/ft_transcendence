import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
import fs from 'fs'
import path from 'path';

export interface UpdateAvatarBody {
	email: string;
}

// export const updateAvatar = async (request: FastifyRequest<{ Body: UpdateAvatarBody }>, reply: FastifyReply) => {
// 	const { email } = request.body;
// 	const files = await request.file();
// 	if (!files || !email) {
// 		return reply.status(400).send({ error: "Missing file or userId" });
// 	}

// 	const filename = `avatar-user-${email}-${Date.now()}-${files.filename}`;
// 	const uploadPath = path.join(__dirname, '../../public/uploads', filename);

// 	const stream = fs.createWriteStream(uploadPath);
// 	await files.file.pipe(stream);
// 	const relativePath = `/uploads/${filename}`;
// 	try {
// 		const result = await new Promise((resolve, reject) => {
// 			db.run('UPDATE users SET avatar_path = ? WHERE email = ?', [relativePath, email], function (err) {
// 				if (err) return reject(err);
// 				if (this.changes === 0) return reject(new Error("User not found"));
// 				resolve("Avatar updated");
// 			});
// 		});

// 		reply.code(200).send({ message: result });
// 	} catch (err: any) {
// 		reply.code(400).send({ error: err.message });
// 	}
// };

export const updateAvatar = async (request: FastifyRequest, reply: FastifyReply) => {
	const parts = request.parts();
	let email = "";
	let uploadedFile: any;

	for await (const part of parts) {
		if (part.type === "file" && part.fieldname === "avatar") {
			uploadedFile = part;
		} else if (part.type === "field" && part.fieldname === "email") {
			email = part.value as string;
		}
	}

	if (!uploadedFile || !email) {
		return reply.status(400).send({ error: "Missing file or email" });
	}
	

	const filename = `avatar-user-${email}-${Date.now()}-${uploadedFile.filename}`;
	const uploadPath = path.join(__dirname, '../../public/uploads', filename);

	const stream = fs.createWriteStream(uploadPath);
	await uploadedFile.file.pipe(stream);

	const relativePath = `http://localhost:3000/uploads/${filename}`;

	try {
		await new Promise((resolve, reject) => {
			db.run('UPDATE users SET avatar_path = ? WHERE email = ?', [relativePath, email], function (err) {
				if (err) return reject(err);
				if (this.changes === 0) return reject(new Error("User not found"));
				
				resolve("Avatar updated");
			});
		});

		reply.code(200).send({ avatarPath: relativePath });
	} catch (err: any) {
		reply.code(400).send({ error: err.message });
	}
};