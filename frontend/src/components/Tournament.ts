import { log } from "console";
import { Div, Button, P, Span, Input } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender, navigateTo } from "../router/router";
import { inputWrapperCss, inputScaleCss } from "../styles/cssFactory";

var playerCount = 4;


export let Registerplayers = false;

let nameError = false;

let showMatchOrder = false;

let ErrNbPlayers = false;

let playerNames: string[] = [];



export function Tournament(): PongNode<any>{

	if (!Registerplayers)
	{
		return Div({ class: "flex flex-col justify-center items-center min-h-screen bg-black text-white p-8" }, [

			Span({ class: "text-4xl font-orbitron mb-6 text-yellow-400" }, ["Tournament Mode"]),
			Span({ class: "text-2xl font-orbitron mb-4" }, ["Select Number of Players:"]),
			PlayerSelector(),

			Div({ class: "flex flex-col justify-between items-center" }, [
				Span({ class: "text-lg mb-4" }, ["Each match will be 1v1 elimination."]),
				Button({
					id: "Register-players",
					onClick: () => {
					if (playerCount == 4 || playerCount == 8){
						Registerplayers = true; playerNames = Array(playerCount).fill(""); rerender(); }
					else ErrNbPlayers = true; rerender();},
					class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded shadow-lg transition duration-300"
				}, ["Register players"]),
				...(ErrNbPlayers ? [Span({ class: "text-red-500 font-semibold mt-2" }, ["Tournament requires 4 or 8 players."])] : []),
			]),
			Button({ id: "back-to-menu-game",
				onClick: () => { navigateTo('/game'); },
				class: "mt-10 text-yellow-300 underline hover:text-yellow-100"
			}, ["← Back to Menu"])
		]);
	}
	else
	{

		const playerInputs = playerNames.map((name, index) => {
			return Div({ class: "flex flex-col" }, [
				Input({ 
					id: `player-${index}`, 
					required: true, 
					placeholder: `Player ${index + 1}`, 
					value: playerNames[index],
					onChange: () => {
						const input = document.getElementById(`player-${index}`) as HTMLInputElement;
						if (input) {
							playerNames[index] = input.value;
							console.log("Name:", playerNames[index]);
						}
					},
					class: inputScaleCss
				})
			]);
		});

		if (!showMatchOrder)
		{
			return Div({ class: "flex flex-col justify-center items-center min-h-screen bg-black text-white p-8 "}, [
				Span({ class: "text-4xl font-orbitron mb-6 text-yellow-400" }, ["Tournament Mode"]),
				Span({ class: "text-2xl font-orbitron mb-4" }, [`Usernames: `]),

				...playerInputs,
				...(nameError ? [Span({ class: "text-red-500 font-semibold mt-2" }, ["All players must have a name."])] : []),

				Button({ id: "starttournament", 
				class: "mt-6 bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded shadow-lg transition duration-300",
				onClick: () => {
					if (playerNames.some(name => name.trim() === "")) {
						nameError = true;
						rerender();
						return;
					}
					nameError = false;
					showMatchOrder = true;
					rerender();
					}
				}, ["Show Match Order"]),
			]);
		}
		else
		{
			return Div({ class: "flex flex-col justify-center items-center min-h-screen bg-black text-white p-8" }, [

				Div({ class: "flex flex-col items-center bg-black mx-4" }, [
				  Span({ class: "text-xl font-bold mb-4 text-yellow-400" }, ["Quarterfinals"]),
				  ...playerNames.reduce((acc, name, i) => {
					  if (i % 2 === 0) {
						acc.push(
						  Div({ class: "mb-6" }, [
							Div({ class: "border border-yellow-500 p-2 w-32 text-center mb-1 rounded bg-black text-white" }, [`${playerNames[i]}`]),
							Div({ class: "border border-yellow-500 p-2 w-32 text-center rounded bg-black text-white" }, [`${playerNames[i + 1]}`]),
						  ])
						);
					  }
					  return acc;
					}, [] as PongNode<any>[])
				]),
			]);
			// return Div ({ class: "flex flex-col justify-center items-center min-h-screen bg-black text-white p-8 "}, [
			// 	Span({ class: "text-4xl font-orbitron mb-6 text-yellow-400" }, ["TREE"]),
			// ...playerNames.map((name, index) =>
			// 	Span({class: "text-4xl font-orbitron mb-6 text-yellow-400" }, [`${playerNames[index]}`]),
			// 	),
			// ]);
		}
	}
}


export function PlayerSelector(): PongNode<any> {

	const decrement = () => {
		if (playerCount > 4) {
			playerCount--;
			rerender();
		}
	};

	const increment = () => {
		if (playerCount < 8) {
			playerCount++;
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
