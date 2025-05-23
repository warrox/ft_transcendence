import { Div, Button, P, Span, Input } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender, navigateTo } from "../router/router";
import { inputScaleCss } from "../styles/cssFactory";
import { MeData } from "./Home";
import { t } from "i18next";
import i18n from "i18next";

var playerCount = 4;

let Registerplayers = false;

let nameError = false;
let errLength = false;
let errSameName = false;

let showMatchOrder = false;

let ErrNbPlayers = false;

let playerNames: string[] = [];


let roundWinners: string[] = [];

let is_8_players = false;

let ingame:boolean = true;

let player1: string;
let player2: string;
let user: string;

let is_finale = false;

let CurrentMatchIndex: number = 0;

const mapStyles: { [key: string]: string} = {
		"Default": "yellow-400",
		"Classic": "neutral-400",
		"Emerald": "emerald-500",
		"Cyan": "cyan-500",
		"Rose": "rose-600",
		"Fushia": "fuchsia-400",
		"Indigo": "indigo-900",
	};

	const hoverStyles: { [key: string]: string} = {
		"Default": "yellow-500",
		"Classic": "neutral-500",
		"Emerald": "emerald-600",
		"Cyan": "cyan-600",
		"Rose": "rose-700",
		"Fushia": "fuchsia-500",
		"Indigo": "indigo-950",
	};

const backButtonStyles: { [key: string]: string} = {
		"Default": "text-yellow-300",
		"Classic": "text-neutral-300",
		"Emerald": "text-emerald-400",
		"Cyan": "text-cyan-400",
		"Rose": "text-rose-500",
		"Fushia": "text-fuchsia-300",
		"Indigo": "text-indigo-800",
	};

const backButtonHoverStyles: { [key: string]: string} = {
		"Default": "hover:text-yellow-100",
		"Classic": "hover:text-neutral-100",
		"Emerald": "hover:text-emerald-200",
		"Cyan": "hover:text-cyan-200",
		"Rose": "hover:text-rose-300",
		"Fushia": "hover:text-fuchsia-100",
		"Indigo": "hover:text-indigo-600",
	};

let PongColor:string | null = null;
let hoverColor:string | null = null;
let backButtonColor:string | null = null;
let backButtonHoverColor:string | null = null;

export function Tournament(): PongNode<any>{

	let color:string | null = null;
	color = localStorage.getItem("Color");

	if (!color)
		color = "Default";
	if (color){
		PongColor = mapStyles[color];
		hoverColor = hoverStyles[color];
		backButtonColor = backButtonStyles[color];
		backButtonHoverColor = backButtonHoverStyles[color];
	}

	const fetchUsername = () => {
			if (user) return;
	
			fetch("/api/me", {
				credentials: "include",
			})
				.then((res) => {
					if (!res.ok) throw new Error("/api/me: Failed");
					return res.json();
				})
				.then((data: MeData) => {
					user = data.name;
				})
				.catch((e) => console.error(e));
		};

	fetchUsername();
	playerNames[0] = user;

	if (!Registerplayers)
	{
		return Div({ class: "flex flex-col justify-center items-center min-h-screen bg-black text-white p-8" }, [

			Span({ class: `text-4xl font-orbitron mb-6 text-${PongColor}` }, [t("tournament.tournament_mode")]),
			Span({ class: "text-2xl font-orbitron mb-4" }, [t("tournament.select_number_of_players")]),
			PlayerSelector(),

			Div({ class: "flex flex-col justify-between items-center" }, [
				Span({ class: "text-lg mb-4" }, [t("tournament.match_format_info")]),
				Button({
					id: "Register-players",
					onClick: () => {
					if (playerCount == 4 || playerCount == 8){
						Registerplayers = true; playerNames = Array(playerCount).fill(""); rerender(); }
					else ErrNbPlayers = true; rerender();},
					class: `bg-${PongColor} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300`
				}, [t("tournament.register_players")]),
				...(ErrNbPlayers ? [Span({ class: "text-red-500 font-semibold mt-2" }, [t("tournament.player_count_requirement")])] : []),
			]),
			Button({ id: "back-to-menu-game",
				onClick: () => { navigateTo('/game'); },
				class: `mt-10 ${backButtonColor} underline ${backButtonHoverColor}`
			}, [t("tournament.back_to_game_menu_arrow")])
		]);
	}
	else
	{

		const playerInputs = playerNames.map((name, index) => {
			if (index == 0)
				return Div({ class: "flex flex-col" }, [
			Span({id: "player 1", class: inputScaleCss}, [`${playerNames[0]}`]),]);
			else
			{
				return Div({ class: "flex flex-col" }, [
					Input({ 
						id: `player-${index}`, 
						required: true, 
						placeholder: t("tournament.player") + `${index + 1}`, 
						value: playerNames[index],
						onChange: () => {
							const input = document.getElementById(`player-${index}`) as HTMLInputElement;
							if (input) {
								playerNames[index] = input.value;
							}
						},
						class: inputScaleCss
					})
				]);
			}
		});

		if (!showMatchOrder)
		{
			return Div({ class: "flex flex-col justify-center items-center min-h-screen bg-black text-white p-8 "}, [
				Span({ class: `text-4xl font-orbitron mb-6 text-${PongColor}` }, [t("tournament.tournament_mode")]),
				Span({ class: "text-2xl font-orbitron mb-4" }, [t("tournament.usernames")]),

				...playerInputs,
				...(nameError ? [Span({ class: "text-red-500 font-semibold mt-2" }, [t("tournament.name_required")])] : []),
				...(errLength ? [Span({ class: "text-red-500 font-semibold mt-2" }, [t("tournament.name_length_limit")])] : []),
				...(errSameName ? [Span({ class: "text-red-500 font-semibold mt-2" }, [t("tournament.same_name")])] : []),

				Button({ id: "starttournament", 
				class: `mt-6 bg-${PongColor} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300`,
				onClick: () => {
					if (playerNames.some(name => name.trim() === "")) {
						nameError = true;
						rerender();
						return;
					}
					else if (playerNames.some(name => name.length > 10))
					{
						nameError = false;
						errLength = true;
						rerender();
						return;
					}
					else if (playerNames.length != new Set(playerNames).size)
					{
						nameError = false;
						errLength = false;
						errSameName = true;
						rerender();
						return;
					}
					nameError = false;
					errLength = false;
					errSameName = false;
					showMatchOrder = true;
					rerender();
					}
				}, [t("tournament.show_match_order")]),
				Button({ id: "back-to-nbplayer-game",
					onClick: () => { Registerplayers = false; rerender();},
					class: `mt-10 ${backButtonColor} underline ${backButtonHoverColor}`
				}, [t("tournament.change_number_of_players_arrow")])
			]);
		}
		else if (CurrentMatchIndex == 0)
		{
			return Div({ class: "flex flex-col justify-center items-center min-h-screen bg-black text-white p-8" }, [

				Div({ class: "flex flex-col items-center bg-black mx-4" }, [
				  Span({ class: `text-xl font-bold mb-4 text-${PongColor}` }, [t("tournament.quarterfinals")]),
				  ...playerNames.reduce((acc, name, i) => {
					  if (i % 2 === 0) {
						acc.push(
						  Div({ class: "mb-6" }, [
							Div({ class: `border border-${PongColor} p-2 w-32 text-center mb-1 rounded bg-black text-white` }, [`${playerNames[i]}`]),
							Div({ class: `border border-${PongColor} p-2 w-32 text-center rounded bg-black text-white` }, [`${playerNames[i + 1]}`]),
						  ])
						);
					  }
					  return acc;
					}, [] as PongNode<any>[])
				]),
				Button({
					id: "Start-tournament",
					onClick: () => {CurrentMatchIndex = 1; rerender();},
					class: `bg-${PongColor} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300`
				}, [t("tournament.first_match") + `${playerNames[0]} vs ${playerNames[1]}`]),
				Button({ id: "back-to-register-players",
					onClick: () => { showMatchOrder = false; rerender();},
					class: `mt-10 ${backButtonColor} underline ${backButtonHoverColor}`
				}, [t("tournament.edit_player_names_arrow")])
			]);
		}
		else
		{
			if (playerNames.length == 8) is_8_players = true;
			if ((CurrentMatchIndex < 3 && !is_8_players) || (CurrentMatchIndex < 5 && is_8_players))
			{
				player1 = playerNames[(CurrentMatchIndex - 1) * 2];
				player2 = playerNames[((CurrentMatchIndex - 1) * 2) + 1];
			}
			else if (CurrentMatchIndex == 3 && !is_8_players)
			{
				player1 = roundWinners[1];
				player2 = roundWinners[2];
			}
			else if (CurrentMatchIndex == 4 && !is_8_players)
				is_finale = true;
			else if (CurrentMatchIndex < 7 && is_8_players)
			{
				player1 = roundWinners[(CurrentMatchIndex - 4) * 2 - 1];
				player2 = roundWinners[((CurrentMatchIndex - 4) * 2)];
			}
			else if (CurrentMatchIndex == 7)
			{
				player1 = roundWinners[5];
				player2 = roundWinners[6];
			}
			else if (CurrentMatchIndex == 8)
				is_finale = true;
			if (ingame)
			{
				setTimeout(() => {
					movePad();
					playPong();}, 0);
				return Div({ class: "flex flex-col items-center justify-center min-h-screen bg-black" }, [
					Div({ class: `text-${PongColor} font-orbitron text-4xl mb-4` }, [
						Span({id: "player 1", class: "mx -8"}, [`${player1}`]),
						Span({ id: "score-left", class: "mx-8" }, ["0"]),
						Span({}, ["  : "]),
						Span({ id: "score-right", class: "mx-8" }, ["0"]),
						Span({class: "mx -8"}, [`${player2}`]),
					]),
					Div({ id: "game-area", class: `relative w-[1600px] h-[800px] bg-zinc-900 overflow-hidden` }, [
						Div({ id: `midline`, class: `absolute top-0 left-1/2 w-[4px] h-full bg-${PongColor} opacity-40 transform -translate-x-1/2` }),
						Div({ id: `ball`, class: `absolute w-[20px] h-[20px] bg-${PongColor} rounded-full` }),
						Div({ id: `leftpad`, class:`absolute w-[15px] h-[80px] bg-${PongColor} left-[5px] top-[360px]` }),
						Div({ id: `rightpad`, class:`absolute w-[15px] h-[80px] bg-${PongColor} left-[1580px] top-[360px]` }),
					]),
				]);
			}
			else
			{
				return Div({ class: "flex flex-col items-center justify-center min-h-screen bg-black" }, [
					Div({ class: `text-${PongColor} font-orbitron text-4xl mb-4` }, [
						Span({id: "player 1", class: "mx -8"}, [`${player1}`]),
						Span({ id: "score-left", class: "mx-8" }, ["0"]),
						Span({}, ["  : "]),
						Span({ id: "score-right", class: "mx-8" }, ["0"]),
						Span({class: "mx -8"}, [`${player2}`]),
					]),
					Div({ id: "game-area", class: "relative w-[1600px] h-[800px] bg-zinc-900 overflow-hidden" }, [
						Span({
							class: `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 block font-orbitron md:text-7xl text-${PongColor} text-center`
						}, [is_finale ? t("tournament.tournament_winner") + `${roundWinners[CurrentMatchIndex - 1]}` : t("tournament.winner") + `${roundWinners[CurrentMatchIndex - 1]}`]),
					
						is_finale
							? Button({
								id: "back-to-menu",
								onClick: () => { is_finale = false;
									Registerplayers = false;
									showMatchOrder = false;
									CurrentMatchIndex = 0
									roundWinners = [];
									playerNames = [];
									ingame = true;
									navigateTo('/game'); },
								class: `absolute top-[550px] left-1/2 transform -translate-x-1/2 bg-${PongColor} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded`
							}, [t("tournament.back_to_game_menu")])
							: Button({
								id: "next-game-btn",
								onClick: () => {
									ingame = true;
									rerender();
								},
								class: `absolute top-[550px] left-1/2 transform -translate-x-1/2 bg-${PongColor} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded`
							}, [t("tournament.next_game") + `${player1} vs ${player2}`]),
						Div({ id: "leftpad2", class:`absolute w-[15px] h-[90px] bg-${PongColor} left-[5px] top-[360px]` }),
						Div({ id: "rightpad2", class:`absolute w-[15px] h-[90px] bg-${PongColor} left-[1580px] top-[360px]` }),
					]),
				]);
			}
		}
	}
}




export function PlayerSelector(): PongNode<any> {

	const decrement = () => {
		if (playerCount > 4) {
			playerCount -= 4;
			rerender();
		}
	};

	const increment = () => {
		if (playerCount < 8) {
			playerCount += 4;
			rerender();
		}
	};

	return Div({ class: "flex flex-col items-center gap-2 p-4" }, [
		P({ class: "text-lg font-semibold" }, [t("tournament.number_of_players")]),
		
		Div({ class: "flex items-center gap-4" }, [
			Button({
				id: "left-arrow",
				class: `bg-${PongColor} hover:bg-${hoverColor} text-xl px-4 py-2 rounded`,
				onClick: decrement
			}, ["<"]),
			
			P({
				class: "text-xl font-bold w-8 text-center"
			}, [`${playerCount}`]),

			Button({
				id: "right-arrow",
				class: `bg-${PongColor} hover:bg-${hoverColor} text-xl px-4 py-2 rounded`,
				onClick: increment
			}, [">"]),
		])
	]);
}

const keysPressed: { [key: string]: boolean} = {};

document.addEventListener("keydown", (event) => {
	keysPressed[event.key] = true;
});

document.addEventListener("keyup", (event) => {
	keysPressed[event.key] = false;
});

export function movePad(){

	const leftpad = document.getElementById("leftpad") as HTMLDivElement;
	const rightpad = document.getElementById("rightpad") as HTMLDivElement;
	const gameArea = document.getElementById("game-area") as HTMLDivElement;

	if (!leftpad || !rightpad || !CurrentMatchIndex)
		return ;

	const padSpeeed = 10;

	if (keysPressed["w"] || keysPressed["W"])
	{
		if (leftpad.offsetTop - padSpeeed > 0)
			leftpad.style.top = `${leftpad.offsetTop - padSpeeed}px`;
	}
	if (keysPressed["s"] || keysPressed["S"])
	{
		if (leftpad.offsetTop + leftpad.offsetHeight + padSpeeed < gameArea.clientHeight)
			leftpad.style.top = `${leftpad.offsetTop + padSpeeed}px`;
	}
	if (keysPressed["ArrowUp"])
	{
		if (rightpad.offsetTop - padSpeeed > 0)
			rightpad.style.top = `${rightpad.offsetTop - padSpeeed}px`;
	}
	if (keysPressed["ArrowDown"])
	{
		if (rightpad.offsetTop + rightpad.offsetHeight + padSpeeed < gameArea.clientHeight)
			rightpad.style.top = `${rightpad.offsetTop + padSpeeed}px`;
	}

	requestAnimationFrame(movePad);
}

export function playPong(){
	const ball = document.getElementById("ball") as HTMLDivElement;
	const gameArea = document.getElementById("game-area") as HTMLDivElement;
	const leftpad = document.getElementById("leftpad") as HTMLDivElement;
	const rightpad = document.getElementById("rightpad") as HTMLDivElement;

	if (!ball || !gameArea || !leftpad || !rightpad || !CurrentMatchIndex)
		return ;

	let x = gameArea.clientWidth / 2;
	let y = gameArea.clientHeight / 2;
	let dx = 4;
	let dy = Math.floor(Math.random() * 11) - 5;
	let leftScore = 0;
	let rightScore = 0;
	const leftscorepan = document.getElementById("score-left");
	const rightscorepan = document.getElementById("score-right");


	function moveBall(){
		if (leftscorepan && rightscorepan && (leftscorepan.textContent == "5" || rightscorepan.textContent == "5"))
		{
			if (leftscorepan.textContent == "5") roundWinners[CurrentMatchIndex] = player1;
			else roundWinners[CurrentMatchIndex] = player2;
			ingame = false;
			CurrentMatchIndex++;
			rerender();
			return ;
		}
		if (x <= 0 || x + ball.clientWidth >= gameArea.clientWidth)
		{
			
			if (x <= 0 && rightscorepan)
			{
				rightScore++;
				dx = -4;
				rightscorepan.textContent = String(rightScore);
			}
			else if (x + ball.clientWidth >= gameArea.clientWidth && leftscorepan)
			{
				leftScore++;
				dx = 4;
				leftscorepan.textContent = String(leftScore);
			}
			dy = Math.floor(Math.random() * 11) - 5;
			x = gameArea.clientWidth / 2;
			y = gameArea.clientHeight / 2;
		}

		if ((y <= leftpad.offsetTop + leftpad.offsetHeight && y >= leftpad.offsetTop) &&  (x <= leftpad.offsetLeft + leftpad.clientWidth && dx < 0))
		{
			dx = (dx * -1) + 1;
			dy = ((y + (ball.clientHeight / 2)) - (leftpad.offsetTop + (leftpad.offsetHeight / 2))) * 0.3;
		}
		if ((y <= rightpad.offsetTop + rightpad.offsetHeight && y >= rightpad.offsetTop) && (x + ball.clientWidth >= rightpad.offsetLeft && dx > 0))
		{
			dx = (dx * -1) - 1;
			dy = ((y + (ball.clientHeight / 2)) - (rightpad.offsetTop + (rightpad.offsetHeight / 2))) * 0.3;
		}
		if (dx >= 15)
			dx = 15;
		else if (dx <= -15)
			dx = -15;
		if (y <= 0 || y + ball.clientWidth >= gameArea.clientHeight)
			dy *= -1;
		x += dx;
		y += dy;
		ball.style.left = `${x}px`;
		ball.style.top = `${y}px`;

		requestAnimationFrame(moveBall);
	}

	requestAnimationFrame(moveBall);
}