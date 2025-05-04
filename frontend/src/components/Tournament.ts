import { Div, Button, P, Span, Li, Image } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender, navigateTo } from "../router/router";

var playerCount = 1;

export function Tournament(): PongNode<any>{
	return Div({ class: "flex flex-col justify-center items-center min-h-screen bg-black text-white p-8" }, [

		Span({ class: "text-4xl font-orbitron mb-6 text-yellow-400" }, ["Tournament Mode"]),
		
		Span({ class: "text-2xl font-orbitron mb-4" }, ["Select Number of Players:"]),

		// Reuse your PlayerSelector component
		PlayerSelector(),

		Div({ class: "flex flex-col items-center mt-10" }, [
			Span({ class: "text-lg mb-4" }, ["Each match will be 1v1 elimination."]),
			Button({
				id: "startTournament",
				//onClick: startTournament, 
				class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded shadow-lg transition duration-300"
			}, ["Start Tournament"])
		]),

		Button({ id: "back-to-menu-game",
			onClick: () => { navigateTo('/game'); },
			class: "mt-10 text-yellow-300 underline hover:text-yellow-100"
		}, ["← Back to Menu"])
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
		if (playerCount < 100) {
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
				class: "bg-yellow-400 hover:bg-yellow-300 text-xl px-4 py-2 rounded",
				onClick: decrement
			}, ["<"]),
			
			P({
				class: "text-xl font-bold w-8 text-center"
			}, [`${playerCount}`]),

			Button({
				id: "right-arrow",
				class: "bg-yellow-400 hover:bg-yellow-300 text-xl px-4 py-2 rounded",
				onClick: increment
			}, [">"]),
		])
	]);
}
