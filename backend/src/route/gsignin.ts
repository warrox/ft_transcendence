import { User } from "../index";
import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
import { server } from "../index";

export const gsignin = async(request : FastifyRequest<{Body : User} >, reply : FastifyReply) => {
	// Step 1 stock call from google api 
	const token = request.body;
	console.log(token);
	// step 2 stock Mail, name, surname in an object
	// step 3 send it to your post.ts and call the googleregister function if the return is yes fill 
	// step 4 handle it as a notmal register
}

