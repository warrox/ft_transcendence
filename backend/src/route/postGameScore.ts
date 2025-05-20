import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
const contract = require("../../blockchain/contractConfig")

export interface PostGameScoreBody {
	userId: number;
	result: "win" | "lose";
	score: string;
	guestName: string;
}

export const postGameScore = async (
	request: FastifyRequest<{ Body: PostGameScoreBody }>,
	reply: FastifyReply
) => {
	const { userId, result, score, guestName } = request.body;

	try {
		const res = await new Promise((resolve, reject) => {
			const query = `
			INSERT INTO games (user_id, result, guest_name, score)
			VALUES (?, ?, ?, ?)
			`;
			db.run(query, [userId, result, score, guestName], function (err) {
				if (err) return reject(err);
				resolve({ message: "Game score inserted", gameId: this.lastID });

			});
		});	
		const tx = await contract.putScore(userId , new Date().toISOString(), score === "win", guestName || "");
		await tx.wait();
		reply.code(200).send(result);
	} catch (err: any) {
		reply.code(400).send({ error: err.message });
	}
};

