import { log } from "console";
import { Div, Button, P, Span, Li } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender, navigateTo } from "../router/router";


let gameStarted = false;

export function Game(): PongNode<any> {
	setTimeout(() => {
		loadMap();
		movePad();
		playPong();
	}, 0);


	if (gameStarted == false)
	{
			return Div({ class: "flex flex-col justify-around items-center min-h-screen p-5 bg-black" }, [
				Span({ class: "block font-orbitron md:text-5xl text-yellow-400" }, ["Pong like you’ve never played it before."]),
				Span({ class: "block font-orbitron md:text-3xl text-yellow-400" }, ["Choose your map:"]),
				
				//PlayerSelector(),
				Button({
					id: "Select-map",
					class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded"
				}, ["Select map"]),
				Div({ id: "game-area", class: "relative w-[600px] h-[400px] bg-zinc-900 overflow-hidden" }, [
					Div({ id: "ball", class: "absolute w-[20px] h-[20px] bg-yellow-400 rounded-full" }),
					Div({ id: "leftpad", class:"absolute w-[15px] h-[80px] bg-yellow-400 rounded-full left-[5px] top-[160px]" }),
					Div({ id: "rightpad", class:"absolute w-[15px] h-[80px] bg-yellow-400 rounded-full left-[580px] top-[160px]" })
				]),
				Div({ class: "flex flex-col justify-around items-center h-30"}, [
					Span({ class: "block font-orbitron md:text-2xl text-yellow-400" }, ["Go solo or battle your friends!:" ]),
					Div({ class: "flex justify-between w-130"}, [
						Button({id: "sgplayerButton",
							class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded transition duration-300"},
							["Single Player"]),
						Button({id: "mgplayerButton",
							onClick: () => {
								gameStarted = true;
								rerender();
							},
							class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded transition duration-300"},
							["Multiple Player"]),
						Button({id: "tournamentButton",
							onClick: () => {
								navigateTo('/tournament');},
							class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded transition duration-300"},
							["Tournament Mode"]),
					]),
				]),
		]);
	}
	else
	{
		return Div({ class: "flex flex-col items-center justify-center min-h-screen bg-black" }, [
			Div({ class: "text-yellow-400 font-orbitron text-4xl mb-4" }, [
				Span({ id: "score-left", class: "mx-8" }, ["0"]),
				Span({}, [" : "]),
				Span({ id: "score-right", class: "mx-8" }, ["0"]),
			]),
            Div({ id: "game-area", class: "relative w-[1600px] h-[800px] bg-zinc-900 overflow-hidden" }, [
				Div({ id: "midline", class: "absolute top-0 left-1/2 w-[4px] h-full bg-yellow-400 opacity-40 transform -translate-x-1/2" }),
                Div({ id: "ball", class: "absolute w-[20px] h-[20px] bg-yellow-400 rounded-full" }),
				Div({ id: "leftpad", class:"absolute w-[15px] h-[80px] bg-yellow-400 left-[5px] top-[360px]" }),
				Div({ id: "rightpad", class:"absolute w-[15px] h-[80px] bg-yellow-400 left-[1580px] top-[360px]" }),
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

export function movePad(){

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


export function playPong(){
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

        if ((y <= leftpad.offsetTop + leftpad.offsetHeight && y >= leftpad.offsetTop) &&  (x <= leftpad.offsetLeft + leftpad.clientWidth && dx < 0))
		{
            dx = (dx * -1) + 2;
			dy = ((y + (ball.clientHeight / 2)) - (leftpad.offsetTop + (leftpad.offsetHeight / 2))) * 0.3;
		}
        if ((y <= rightpad.offsetTop + rightpad.offsetHeight && y >= rightpad.offsetTop) && (x + ball.clientWidth >= rightpad.offsetLeft && dx > 0))
        {
			dx = (dx * -1) - 2;
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


// /me