import { Div, Button, Input, Span, Li } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { MeData } from "./Home";
import { rerender, navigateTo } from "../router/router";
import { inputScaleCss } from "../styles/cssFactory";

import { sleep } from 'sleep-ts';
import { userInfo } from "os";
import { Tournament } from "./Tournament";

import { t } from "i18next";
import i18n from "i18next";

let gameStarted = 0;

let player1:string | null = null;
let userId: number = -1;

let player2: string = "";

let mapIndex = 0;

let winner = "";
let result: "win" | "lose";
let score: string;
let guestName:string;

let nameError = false;
let errLength = false;

let isplayPong = false;

let registerplayer = false;

const ballState = {
	x: 0,
	y: 0,
	dx: 4,
	dy: 0,
};

let leftScore = 0;
let rightScore = 0;


export function Game(): PongNode<any> {
	setTimeout(() => {
		loadMap();
		movePad();
		playPong();
	}, 0);

	const fetchUsername = () => {
		if (player1 != null && userId != -1) return;
		console.log("Je recup un username");
		fetch("/api/me", {
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				if (!res.ok) throw new Error("/api/me: Failed");
				return res.json();
			})
			.then((data: MeData) => {
				console.log("DATA name: ", data.name);
				if (player1 == null) player1 = data.name;
				if (userId == -1) userId = data.id;
			})
			.catch((e) => console.error(e));
	};
	
	fetchUsername();
	console.log("Player1: ", player1);
	console.log("PlayerId: ", userId);
	
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
	}

	const mapKeys = Object.keys(mapStyles);
	let PongColor = mapStyles[mapKeys[mapIndex]];
	let hoverColor = hoverStyles[mapKeys[mapIndex]];

	const prev_color = () => {
		if (mapIndex != 0) {
			mapIndex--;
			PongColor = mapStyles[mapKeys[mapIndex]];
			rerender();
		}
	};

	const next_color = () => {
		if (mapIndex != 6) {
			mapIndex++;
			PongColor = mapStyles[mapKeys[mapIndex]];
			rerender();
		}
	}


	if (gameStarted == 0)
	{
			return Div({ class: "flex flex-col justify-around items-center min-h-screen p-5 bg-black" }, [
				Span({ class: `block font-orbitron md:text-5xl text-${PongColor}` }, [t("game.never_play")]),
				Span({ class: `block font-orbitron md:text-3xl text-${PongColor}` }, [t("game.choose_map")]),
				Div({ class: "flex items-center"} , [Span({ class: `block font-orbitron md:text-2xl text-${PongColor}`}, [`${mapKeys[mapIndex]}`])]),
				Div({ class: "flex justify-between items-center" }, [
					Button({ id: "left-arrow", class: `bg-${PongColor} hover:bg-${hoverColor} text-xl text-white px-4 py-2 rounded mr-10`, onClick: prev_color }, ["<"]),
					Div({ id: "game-area", class: "relative w-[600px] h-[400px] bg-zinc-900 overflow-hidden" }, [
						Div({ id: "ball", class: `absolute w-[20px] h-[20px] bg-${PongColor} rounded-full` }),
						Div({ id: "leftpad", class:`absolute w-[15px] h-[80px] bg-${PongColor} rounded-full left-[5px] top-[160px]` }),
						Div({ id: "rightpad", class:`absolute w-[15px] h-[80px] bg-${PongColor} rounded-full left-[580px] top-[160px]` })
					]),
					Button({ id: "right-arrow", class: `bg-${PongColor} hover:bg-${hoverColor} text-xl text-white px-4 py-2 rounded ml-10`, onClick: next_color }, [">"]),
				]),
				Div({ class: "flex flex-col justify-around items-center h-30"}, [
					Span({ class: `block font-orbitron md:text-2xl text-${PongColor}` }, [t("game.solo_friends")]),
					Div({ class: "flex justify-between w-130"}, [
						Button({id: "sgplayerButton", onClick: () => {
							gameStarted = 2;
							player2 = "AI";
							rerender();
						},
							class: `bg-${PongColor}  hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded`},

							[t("game.single_player")]),
						Button({id: "mgplayerButton", onClick: () => {
								registerplayer = true;
								rerender();
							},

							class: `bg-${PongColor} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded`},
							[t("game.multi_player")]),
						Button({id: "tournamentButton",
							onClick: () => {
								localStorage.setItem("Color", mapKeys[mapIndex]); navigateTo('/tournament');},
							class: `bg-${PongColor} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded`},
							[t("game.tournament")]),
					]),
				]),
				...(registerplayer
				? [
				Div({ class: "absolute inset-0 z-50 flex flex-col items-center justify-center bg-opacity-60" },[
					Input({
						id: "secondPlayerInput",
						required: true,
						placeholder: "Enter second player name",
						onChange: () => {
							const input = document.getElementById("secondPlayerInput") as HTMLInputElement;
							player2 = input?.value || "";
						},
						class: "transform transition duration-200 ease-in-out hover:scale-105 w-[250px] text-white border shadow-[1px_1px_3px_rgba(0,0,0,0.1)] p-2.5 rounded-[5px] border-solid border-[#ccc] relative z-[10]",
					}),
					Button({ id: "staaart-game",
						onClick: () => {
							if (player2.trim() === "") {
								nameError = true;
								rerender();
								return;
							}
							else if (player2.length > 10)
							{
								nameError = false;
								errLength = true;
								rerender();
								return;
							}
							// Lancer le jeu ou logique suivante ici :
							console.log("Second player is:", player2);
							gameStarted = 1;
							rerender();
						},
						class: `bg-${PongColor} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded`
					}, ["Start Game"]),
					...(nameError ? [Span({ class: "text-red-500 font-semibold mt-2" }, ["Player 2 must have a name."])] : []),
					...(errLength ? [Span({ class: "text-red-500 font-semibold mt-2" }, ["Name should not exceed 10 characters."])] : []),
				]),
				] : [])
		]);
	}
	else if (gameStarted == 1 || gameStarted == 2)
	{
		return Div({ class: "flex flex-col items-center justify-center min-h-screen bg-black" }, [
			Div({ class: `text-${PongColor} font-orbitron text-4xl mb-4` }, [
				Span({id: "player 1", class: "mx -8"}, [`${player1}`]),
				Span({ id: "score-left", class: "mx-8" }, ["0"]),
				Span({}, [" : "]),
				Span({ id: "score-right", class: "mx-8" }, ["0"]),
				Span({id: "player 1", class: "mx -8"}, [`${player2}`]),
			]),
            Div({ id: "game-area", class: "relative w-[1600px] h-[800px] bg-zinc-900 overflow-hidden" }, [
				Div({ id: "midline", class: `absolute top-0 left-1/2 w-[4px] h-full bg-${PongColor} opacity-40 transform -translate-x-1/2` }),
                Div({ id: "ball", class: `absolute w-[20px] h-[20px] bg-${PongColor} rounded-full"`}),
				Div({ id: "leftpad", class:`absolute w-[15px] h-[90px] bg-${PongColor} left-[5px] top-[360px]` }),
				Div({ id: "rightpad", class:`absolute w-[15px] h-[90px] bg-${PongColor} left-[1580px] top-[360px]` }),
			]),
		]);
	}
	else
	{
		return Div({ class: "flex flex-col items-center justify-center min-h-screen bg-black" }, [
			Div({ class: `text-${PongColor} font-orbitron text-4xl mb-4` }, [
				Span({id: "player 1", class: "mx -8"}, [`${player1}`]),
				Span({ id: "score-left", class: "mx-8" }, [`${String(leftScore)}`]),
				Span({}, [" : "]),
				Span({ id: "score-right", class: "mx-8" }, [`${String(rightScore)}`]),
				Span({id: "player 1", class: "mx -8"}, [`${player2}`]),
			]),
			Div({ id: "game-area", class: "relative w-[1600px] h-[800px] bg-zinc-900 overflow-hidden" }, [
				Span({class: `absolute left-[550px] top-[250px] block font-orbitron md:text-7xl text-${PongColor} `}, [`WINNER: ${winner}`]),
				Button({ id: "back-to-menu", onClick: () => {
					gameStarted = 0;
					leftScore = 0;
					rightScore = 0;
					rerender();
				},
				class: `absolute left-[730px] top-[450px] bg-${PongColor} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded`}, [t("game.back_menu")]),
				Div({ id: "leftpad", class:`absolute w-[15px] h-[90px] bg-${PongColor} left-[5px] top-[360px]` }),
				Div({ id: "rightpad", class:`absolute w-[15px] h-[90px] bg-${PongColor} left-[1580px] top-[360px]` }),
			]),
		]);
	}
}

const keysPressed: { [key: string]: boolean} = {};

document.addEventListener("keydown", (event) => {
	keysPressed[event.key] = true;
});

document.addEventListener("keyup", (event) => {
	keysPressed[event.key] = false;
});


const padSpeeed = 10;

function movePad(){

	const leftpad = document.getElementById("leftpad") as HTMLDivElement;
	const rightpad = document.getElementById("rightpad") as HTMLDivElement;
	const gameArea = document.getElementById("game-area") as HTMLDivElement;

	if (!leftpad || !rightpad || !gameStarted || gameStarted == 3)
		return ;


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
	if (keysPressed["3"] && gameStarted != 2)
	{
		if (rightpad.offsetTop - padSpeeed > 0)
			rightpad.style.top = `${rightpad.offsetTop - padSpeeed}px`;
	}
	if (keysPressed["."] && gameStarted != 2)
	{
		if (rightpad.offsetTop + rightpad.offsetHeight + padSpeeed < gameArea.clientHeight)
			rightpad.style.top = `${rightpad.offsetTop + padSpeeed}px`;
	}

	requestAnimationFrame(movePad);
}


function playPong(){
	if (isplayPong) return;
	else
	{
		if (gameStarted == 2)
			AI_mov();
	}
  
	const ball = document.getElementById("ball") as HTMLDivElement;
    const gameArea = document.getElementById("game-area") as HTMLDivElement;
	const leftpad = document.getElementById("leftpad") as HTMLDivElement;
	const rightpad = document.getElementById("rightpad") as HTMLDivElement;

	if (!ball || !gameArea || !leftpad || !rightpad || !gameStarted)
		return ;

	ballState.x = gameArea.clientWidth / 2;
	ballState.y = gameArea.clientHeight / 2;
	ballState.dx = 4;
	ballState.dy = Math.floor(Math.random() * 11) - 5;
	const leftscorepan = document.getElementById("score-left");
	const rightscorepan = document.getElementById("score-right");
	

	function moveBall(){
		if (gameStarted == 3)
			return;
		if (leftscorepan && rightscorepan && (leftscorepan.textContent == "5" || rightscorepan.textContent == "5"))
		{
			if (leftscorepan.textContent == "5" && player1){
				winner = player1;
				result = "win";
			}
			else
			{
				if (gameStarted != 2)
					winner = player2;
				else winner = "AI";
				result = "lose";
			}
			score = leftScore.toString() + " " + rightScore.toString();
			console.log("Match score sent: ", score);
			guestName = player2;
			const body = {
				userId,
				result,
				score,
				guestName,
			};
			fetch("/api/postGameScore", {
				method: "POST",
				body: JSON.stringify(body),
				credentials: "include",
				headers: {
				"Content-Type": "application/json",
				},
			})
			.then(async (res) => {
				const data = await res.text(); // ou res.json() si c'est du JSON
				if (!res.ok) {
				  console.error("Erreur HTTP :", res.status, data); // 👈 affiche l’erreur
				  throw new Error(`HTTP error! Status: ${res.status}`);
				} else {
				  console.log("Succès:", data);
				}
			  })
			  .catch((err) => {
				console.error("Erreur dans fetch:", err);
			  });
			gameStarted = 3;
			registerplayer = false;
			rerender();
			return ;
		}
        if (ballState.x <= 0 || ballState.x + ball.clientWidth >= gameArea.clientWidth)
		{
			
			if (ballState.x <= 0 && rightscorepan)
			{
				rightScore++;
				ballState.dx = -4;
				rightscorepan.textContent = String(rightScore);
			}
			else if (ballState.x + ball.clientWidth >= gameArea.clientWidth && leftscorepan)
			{
				leftScore++;
				ballState.dx = 4;
				leftscorepan.textContent = String(leftScore);
			}
			ballState.dy = Math.floor(Math.random() * 11) - 5;
			ballState.x = gameArea.clientWidth / 2;
			ballState.y = gameArea.clientHeight / 2;
		}

        if ((ballState.y<= leftpad.offsetTop + leftpad.offsetHeight && ballState.y + ball.clientHeight >= leftpad.offsetTop) &&  (ballState.x <= leftpad.offsetLeft + leftpad.clientWidth && ballState.dx < 0))
		{
            ballState.dx = (ballState.dx * -1) + 2;
			ballState.dy = ((ballState.y + (ball.clientHeight / 2)) - (leftpad.offsetTop + (leftpad.offsetHeight / 2))) * 0.25;
		}
        if ((ballState.y <= rightpad.offsetTop + rightpad.offsetHeight && ballState.y + ball.clientHeight >= rightpad.offsetTop) && (ballState.x + ball.clientWidth >= rightpad.offsetLeft && ballState.dx > 0))
        {
			ballState.dx = (ballState.dx * -1) - 2;
			ballState.dy = ((ballState.y + (ball.clientHeight / 2)) - (rightpad.offsetTop + (rightpad.offsetHeight / 2))) * 0.25;
		}
		if (ballState.dx >= 15)
			ballState.dx = 15;
		else if (ballState.dx <= -15)
			ballState.dx = -15;
		if (ballState.y <= 0 || ballState.y + ball.clientWidth >= gameArea.clientHeight)
            ballState.dy *= -1;
        ballState.x += ballState.dx;
        ballState.y += ballState.dy;
        ball.style.left = `${ballState.x}px`;
        ball.style.top = `${ballState.y}px`;

		if (gameStarted != 0) requestAnimationFrame(moveBall);
    }

    if (gameStarted != 0) requestAnimationFrame(moveBall);
}

function loadMap(){
    const ball = document.getElementById("ball") as HTMLDivElement;
    const gameArea = document.getElementById("game-area") as HTMLDivElement;

    if (!ball || !gameArea || gameStarted)
        return ;

    let x = 100;
    let y = 100;
    let dx = 4;
    let dy = 4;

    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;
    const ballSize = ball.clientWidth;

    function moveBall(){
        if (x <= 0 || x + ballSize >= areaWidth)
            dx *= -1;
        if (y <= 0 || y + ballSize >= areaHeight)
            dy *= -1;
        if ((y >= 160 && y <= 240) && (x <= 20 && dx < 0))
            dx *= -1;
        if ((y >= 160 && y <= 240) && (x + ballSize >= areaWidth - 20 && dx > 0))
            dx *= -1;
        if (y + ballSize <= 160 && y + ballSize + dy >= 160 && (x + ballSize + dx >= areaWidth - 20 || x + dx <= 20))
                dy *= -1;
        if (y + ballSize >= 240 && y + ballSize - dy <= 240 && (x + ballSize + dx >= areaWidth - 20 || x + dx <= 20))
            dy *= -1;
        x += dx;
        y += dy;
        ball.style.left = `${x}px`;
        ball.style.top = `${y}px`;
        requestAnimationFrame(moveBall);
    }

    requestAnimationFrame(moveBall);
}



async function AI_mov(){
	const ball = document.getElementById("ball") as HTMLDivElement;
	const gameArea = document.getElementById("game-area") as HTMLDivElement;
	const rightpad = document.getElementById("rightpad") as HTMLDivElement;

	if (!ball || !gameArea || !rightpad || gameStarted != 2)
		return ;


	while (gameStarted == 2){
		const x = parseInt(ball.style.left);
		const y = parseInt(ball.style.top);
		const dy = ballState.dy;
		const dx = ballState.dx;

		if (dx > 0)
		{
			const timeToReach = (gameArea.clientWidth - x) / dx;
			let target = y + (dy * timeToReach )+ Math.floor((Math.random() * rightpad.clientHeight)) - rightpad.clientHeight;	

			while (target < 0 || target > gameArea.clientHeight) {
				if (target < 0) target = -target;
				else if (target > gameArea.clientHeight)
					target = 2 * gameArea.clientHeight - target;
			}

			if (target + rightpad.clientHeight > gameArea.clientHeight)
				target = gameArea.clientHeight - rightpad.clientHeight;
			while (Math.abs(rightpad.offsetTop - target) > 10) {
				const padBottom = rightpad.offsetTop + rightpad.clientHeight;

				if (rightpad.offsetTop < target && padBottom + padSpeeed < gameArea.clientHeight)
					rightpad.style.top = `${rightpad.offsetTop + padSpeeed}px`;
				else if (rightpad.offsetTop - padSpeeed > 0)
					rightpad.style.top = `${rightpad.offsetTop - padSpeeed}px`;
				await sleep(16);
			}
		}
		await sleep(1000);
	}
}


