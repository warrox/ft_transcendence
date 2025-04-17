import { User } from "../index";
import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
import { server } from "../index";

export const googleRegister = async(request : FastifyRequest, reply : FastifyReply) => {
	// Step 1 stock call from google api 
	// step 2 stock Mail, name, surname in an object
	// step 3 send it to your post.ts and call the googleregister function if the return is yes fill 
	// step 4 handle it as a notmal register
}

