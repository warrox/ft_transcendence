import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
const contract = require("../../blockchain/contractConfig")

export interface PostGameScoreBody {
	userId: number;
	result: "win" | "lose";
	score: string;
	guestName: string;
	bounce: number;
	input_per_second: number;
}

export const postGameScore = async (
	request: FastifyRequest<{ Body: PostGameScoreBody }>,
	reply: FastifyReply
) => {
	const { userId, result, score, guestName , bounce, input_per_second} = request.body;

	try {
		const res = await new Promise((resolve, reject) => {
			const query = `
			INSERT INTO games (user_id, result, score, guest_name, bounce, input_per_second)
			VALUES (?, ?, ?, ?, ?, ?)
			`;
			db.run(query, [userId, result, score, guestName, bounce, input_per_second], function (err) {
				if (err) return reject(err);
				resolve({ message: "Game score inserted", gameId: this.lastID });

			});
		});
		
		const tx = await contract.putScore(new Date().toISOString(), score, guestName || "");
		await tx.wait();
		reply.code(200).send(result);
	} catch (err: any) {
		console.error("Insert error:", err.message);
		reply.code(400).send({ error: err.message });
	}
};
