import { log } from "console";
import { Div, Button, P } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router"

var playerCount = 1;

export function Game(): PongNode<any> {
	return Div({ class: "flex flex-col justify-between items-center min-h-screen p-15" }, [Div({class: "grid grid-rows-[40%_15%_5%_40%] min-h-screen"}, [
		P({ class: "text-2xl font-bold text-gray-800" }, ["Welcome to Pong"]),
		
		PlayerSelector(),
		Button({
			id: "startgame",
			class: "bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-6 border-b-4 border-green-700 hover:border-green-500 rounded"
		}, ["Start Game"]),
	]),
	]);
}

export function PlayerSelector(): PongNode<any> {

	const decrement = () => {
		if (playerCount > 1) {
			playerCount--;
			console.log(playerCount);
			rerender();
		}
	};

	const increment = () => {
		if (playerCount < 50000) {
			playerCount++;
			console.log(playerCount);
			rerender();
		}
	};

	return Div({ class: "flex flex-col items-center gap-2 p-4" }, [
		P({ class: "text-lg font-semibold" }, ["Number of players:"]),
		
		Div({ class: "flex items-center gap-4" }, [
			Button({
				id: "left-arrow",
				class: "bg-gray-200 hover:bg-gray-300 text-xl px-4 py-2 rounded",
				onClick: decrement
			}, ["<"]),
			
			P({
				class: "text-xl font-bold w-8 text-center"
			}, [`${playerCount}`]),

			Button({
				id: "right-arrow",
				class: "bg-gray-200 hover:bg-gray-300 text-xl px-4 py-2 rounded",
				onClick: increment
			}, [">"]),
		])
	]);
}