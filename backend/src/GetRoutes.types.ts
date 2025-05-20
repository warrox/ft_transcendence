import { FastifyReply, FastifyRequest} from "fastify";
import { me } from "./route/me";
import { users } from "./route/get";
import { checkJWT } from "./route/get";
import { User, GoogleTokenRequest, Code2FARequestBody } from ".";
import { register } from "./route/post"
import { login } from "./route/login"
import { gsignin } from "./route/gsignin"
import { glogin } from "./route/glogin"
import { post2Fa } from "./route/post2Fa";
import{ verify2Fa } from "./route/verify2Fa"
import { logout } from "./route/logout"
import { updateAvatar, UpdateAvatarBody } from "./route/updateAvatar"
import { updateMail, UpdateMailBody} from "./route/updateMail"
import { updatePassword , UpdatePasswordBody} from "./route/updatePassword"
import { UpdateWinLooseBody, updateWinLoose} from "./route/updateWinLoose"
import { PostGameScoreBody , postGameScore} from "./route/postGameScore"
import {  langBody , postLang} from "./route/postLang"
import {  getFriends} from "./route/getFriends"
import { friends } from "./route/postFriends"
import { getAvatar} from "./route/getAvatar"
import { twoFaBody } from "./route/post2Fa";
import { FriendsBody } from "./route/postFriends";
import { getGameScore } from "./route/getGameScore";
import { getBlockchain } from "./route/getBlockchain";

export interface GetRoutes {
	me (request: FastifyRequest, reply: FastifyReply): any
	users (request: FastifyRequest, reply: FastifyReply): any
	checkJWT (request: FastifyRequest, reply: FastifyReply): any
	register (request: FastifyRequest<{ Body: User }>, reply: FastifyReply): Promise<undefined>
	login( request: FastifyRequest<{ Body : User }> , reply: FastifyReply) : any
	gsignin( request: FastifyRequest <{ Body : GoogleTokenRequest }>, reply: FastifyReply ) : any
	glogin( request: FastifyRequest <{ Body : GoogleTokenRequest }>, reply: FastifyReply ) : any
	post2Fa( request: FastifyRequest<{ Body : twoFaBody }> , reply: FastifyReply) : any
	verify2Fa( request: FastifyRequest<{ Body : Code2FARequestBody }> , reply: FastifyReply) : any
	logout( request: FastifyRequest<{ Body : User }> , reply: FastifyReply) : any
	updateAvatar( request: FastifyRequest<{ Body : UpdateAvatarBody }> , reply: FastifyReply) : any
	updateMail( request: FastifyRequest<{ Body : UpdateMailBody }> , reply: FastifyReply) : any
	updatePassword( request: FastifyRequest<{ Body : UpdatePasswordBody }> , reply: FastifyReply) : any
	updateWinLoose( request: FastifyRequest<{ Body : UpdateWinLooseBody }> , reply: FastifyReply) : any
	postGameScore( request: FastifyRequest<{ Body : PostGameScoreBody}> , reply: FastifyReply) : any
	postLang( request: FastifyRequest<{ Body : langBody}> , reply: FastifyReply) : any
	getFriends( request: FastifyRequest , reply: FastifyReply) : any
	getAvatar( request: FastifyRequest , reply: FastifyReply) : any
	friends( request: FastifyRequest<{Body: FriendsBody}>, reply: FastifyReply): any
	getGameScore( request: FastifyRequest, reply: FastifyReply) : any
	getBlockchain( request: FastifyRequest, reply: FastifyReply) : any
}

export const getRoutes: GetRoutes = {
	me: me,
	users: users,
	checkJWT: checkJWT,
	register: register,
	login: login,
	gsignin: gsignin,
	glogin: glogin,
	post2Fa:post2Fa,
	verify2Fa:verify2Fa,
	logout:logout,
	updateAvatar: updateAvatar,
	updateMail: updateMail,
	updatePassword: updatePassword,
	updateWinLoose: updateWinLoose,
	postGameScore: postGameScore,
	postLang: postLang,
	getFriends : getFriends,
	friends: friends,
	getAvatar: getAvatar,
	getGameScore: getGameScore,
	getBlockchain: getBlockchain,
};
