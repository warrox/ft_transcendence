import { Div, Button, P } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";

export function Game(): PongNode<any> {

	return Div ({}, [
		P({}, ["Welcome to Pong"]),
		Button({ id: "startgame"})
	])
}