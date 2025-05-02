import { FastifyReply, FastifyRequest } from 'fastify';
import db from '../../db';
import {User} from '../index'


interface FriendsBody{
	action : "add" | "del";
	emailClient: string;
	emailToAdd: string;
}
 const friends = async( request : FastifyRequest<{Body : FriendsBody}> , reply : FastifyReply ) => {
	 const { action, emailClient, emailToAdd } = request.body;
	if(action === "add"){
		// add emailtoAdd to db
	}
	if(action === "del"){
		//del emailtoDell to db
	}


}

