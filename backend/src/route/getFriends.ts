import { FastifyRequest, FastifyReply } from 'fastify';
import db from '../../db';

type JWTClaims = {
  id: string;
  email: string;
};

type Friend = {
  id: number;
  name: string;
  surname: string;
  email: string;
};

declare const onlineUsers: Set<number>; 
export const getFriends = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
	const token = request.cookies["access_token"];
	if (!token) {
	  return reply.status(401).send({ error: 'Token manquant' });
	}

	const claims = request.server.jwt.decode<JWTClaims>(token);
	const userId = Number(claims?.id);
	if (!userId) {
	  return reply.status(400).send({ error: 'Token invalide' });
	}

	const friends: Friend[] = await new Promise((resolve, reject) => {
	  db.all(
		`SELECT users.id, users.name, users.surname, users.email
		 FROM users
		 JOIN friends ON users.id = friends.friend_id
		 WHERE friends.user_id = ?`,
		[userId],
		(err, rows : any) => {
		  if (err) return reject(err);
		  resolve(rows);
		}
	  );
	});

	const enriched = friends.map(friend => ({
	  ...friend,
	//   online: onlineUsers.has(friend.id), A CAHNGER !!!! FALSE PR DEBUG
		online: false,
	}));

	return reply.status(200).send(enriched);
  } catch (err) {
	console.error(err);
	return reply.status(500).send({ error: "Erreur serveur" });
  }
};
