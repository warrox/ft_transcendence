
// le front doit m'envoyer une string avec win or loose pour update la db

import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";

export interface UpdateWinLooseBody {
	email: string;
	score: "win" | "loose";
}

export const updateWinLoose = async (
	request: FastifyRequest<{ Body: UpdateWinLooseBody }>,
	reply: FastifyReply
) => {
	const { email, score } = request.body;

	if (score !== "win" && score !== "loose") {
		return reply.code(400).send({ error: "Invalid score value" });
	}

	try {
		const result = await new Promise((resolve, reject) => {
			const query = `UPDATE users SET ${score} = ${score} + 1 WHERE email = ?`;
			db.run(query, [email], function (err) {
				if (err) return reject(err);
				if (this.changes === 0) return reject(new Error("User not found"));
				resolve(`${score} updated`);
			});
		});

		reply.code(200).send({ message: result });
	} catch (err: any) {
		reply.code(400).send({ error: err.message });
	}
};
