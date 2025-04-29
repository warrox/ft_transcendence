import { Div, Button, P, Span, Li } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router"

var playerCount = 1;

let gameStarted = false;

let mapIndex = 0;



export function Game(): PongNode<any> {
	setTimeout(() => {
		loadMap();
		movePad();
		playPong();
	}, 0);

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
			console.log(PongColor);
			rerender();
		}
	};

	const next_color = () => {
		if (mapIndex != 6) {
			mapIndex++;
			PongColor = mapStyles[mapKeys[mapIndex]];
			console.log(PongColor);
			rerender();
		}
	}


	if (gameStarted == false)
	{
			return Div({ class: "flex flex-col justify-around items-center min-h-screen p-5 bg-black" }, [
				Span({ class: `block font-orbitron md:text-5xl text-${PongColor}` }, ["Pong like you’ve never played it before."]),
				Span({ class: `block font-orbitron md:text-3xl text-${PongColor}` }, ["Choose your map:"]),
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
					Span({ class: `block font-orbitron md:text-2xl text-${PongColor}` }, ["Go solo or battle your friends!:" ]),
					Div({ class: "flex justify-between w-130"}, [
						Button({id: "sgplayerButton",
							class: `bg-${PongColor}  hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded`},
							["Single Player"]),
						Button({id: "mgplayerButton",
							onClick: () => {
								gameStarted = true;
								rerender();
							},
							class: `bg-${PongColor} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded`},
							["Multiple Player"]),
						Button({id: "tournamentButton",
							class: `bg-${PongColor} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded`},
							["Tournament Mode"]),
					]),
				]),
		]);
	}
	else
	{
		return Div({ class: "flex flex-col items-center justify-center min-h-screen bg-black" }, [
			Div({ class: `text-${PongColor} font-orbitron text-4xl mb-4` }, [
				Span({ id: "score-left", class: "mx-8" }, ["0"]),
				Span({}, [" : "]),
				Span({ id: "score-right", class: "mx-8" }, ["0"]),
			]),
            Div({ id: "game-area", class: "relative w-[1600px] h-[800px] bg-zinc-900 overflow-hidden" }, [
				Div({ id: "midline", class: `absolute top-0 left-1/2 w-[4px] h-full bg-${PongColor} opacity-40 transform -translate-x-1/2` }),
                Div({ id: "ball", class: `absolute w-[20px] h-[20px] bg-${PongColor} rounded-full"`}),
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

function movePad(){

	const leftpad = document.getElementById("leftpad") as HTMLDivElement;
	const rightpad = document.getElementById("rightpad") as HTMLDivElement;
	const gameArea = document.getElementById("game-area") as HTMLDivElement;

	if (!leftpad || !rightpad || !gameStarted)
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
	if (keysPressed["3"])
	{
		if (rightpad.offsetTop - padSpeeed > 0)
			rightpad.style.top = `${rightpad.offsetTop - padSpeeed}px`;
	}
	if (keysPressed["."])
	{
		if (rightpad.offsetTop + rightpad.offsetHeight + padSpeeed < gameArea.clientHeight)
			rightpad.style.top = `${rightpad.offsetTop + padSpeeed}px`;
	}

	requestAnimationFrame(movePad);
}

requestAnimationFrame(movePad);

function playPong(){
	const ball = document.getElementById("ball") as HTMLDivElement;
    const gameArea = document.getElementById("game-area") as HTMLDivElement;
	const leftpad = document.getElementById("leftpad") as HTMLDivElement;
	const rightpad = document.getElementById("rightpad") as HTMLDivElement;

	if (!ball || !gameArea || !leftpad || !rightpad || !gameStarted)
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

        if ((y<= leftpad.offsetTop + leftpad.offsetHeight && y + ball.clientHeight >= leftpad.offsetTop) &&  (x <= leftpad.offsetLeft + leftpad.clientWidth && dx < 0))
		{
            dx = (dx * -1) + 2;
			dy = ((y + (ball.clientHeight / 2)) - (leftpad.offsetTop + (leftpad.offsetHeight / 2))) * 0.25;
		}
        if ((y <= rightpad.offsetTop + rightpad.offsetHeight && y + ball.clientHeight >= rightpad.offsetTop) && (x + ball.clientWidth >= rightpad.offsetLeft && dx > 0))
        {
			dx = (dx * -1) - 2;
			dy = ((y + (ball.clientHeight / 2)) - (rightpad.offsetTop + (rightpad.offsetHeight / 2))) * 0.25;
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

function loadMap(){
    const ball = document.getElementById("ball") as HTMLDivElement;
    const gameArea = document.getElementById("game-area") as HTMLDivElement;

    if (!ball || !gameArea || gameStarted == true)
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
