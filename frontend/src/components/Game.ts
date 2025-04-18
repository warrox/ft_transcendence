import { Div, Button, P } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";

export function Game(): PongNode<any> {
	return Div({ class: "flex flex-col items-center justify-center gap-100 p-15" }, [
		P({ class: "text-2xl font-bold text-gray-800" }, ["Welcome to Pong"]),
		
		Button({
			id: "startgame",
			class: "bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-6 border-b-4 border-green-700 hover:border-green-500 rounded"
		}, ["Start Game"]),
	]);
}