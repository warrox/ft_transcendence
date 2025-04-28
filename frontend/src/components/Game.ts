import { log } from "console";
import { Div, Button, P, Span, Li } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router"

var playerCount = 1;

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
							class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded"},
							["Single Player"]),
						Button({id: "mgplayerButton",
							onClick: () => {
								gameStarted = true;
								rerender();
							},
							class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded"},
							["Multiple Player"]),
						Button({id: "tournamentButton",
							class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded"},
							["Tournament Mode"]),
					]),
				]),
		]);
	}
	else
	{
		return Div({ class: "flex flex-col items-center justify-center min-h-screen bg-black" }, [
            Div({ id: "game-area", class: "relative w-[1600px] h-[800px] bg-zinc-900 overflow-hidden" }, [
                Div({ id: "ball", class: "absolute w-[20px] h-[20px] bg-yellow-400 rounded-full" }),
				Div({ id: "leftpad", class:"absolute w-[15px] h-[80px] bg-yellow-400 rounded-full left-[5px] top-[360px]" }),
				Div({ id: "rightpad", class:"absolute w-[15px] h-[80px] bg-yellow-400 rounded-full left-[1580px] top-[360px]" }),
			]),
		]);
	}
}

function movePad(){
	window.addEventListener("keydown", (event) => {
		const leftpad = document.getElementById("leftpad") as HTMLDivElement;
		const rightpad = document.getElementById("rightpad") as HTMLDivElement;
		const gameArea = document.getElementById("game-area") as HTMLDivElement;
	
		if (!leftpad || !rightpad || !gameStarted)
			return ;

		const padSpeeed = 10;

		switch (event.key){
			case "w":
			case "W":
				if (leftpad.offsetTop - padSpeeed > 0)
					leftpad.style.top = `${leftpad.offsetTop - padSpeeed}px`;
				break;
			case "s":
			case "S":
				if (leftpad.offsetTop + leftpad.offsetHeight + padSpeeed < gameArea.clientHeight)
					leftpad.style.top = `${leftpad.offsetTop + padSpeeed}px`;
				break;
			case "3":
				if (rightpad.offsetTop - padSpeeed > 0)
					rightpad.style.top = `${rightpad.offsetTop - padSpeeed}px`;
				break;
			case ".":
				if (rightpad.offsetTop + rightpad.offsetHeight + padSpeeed < gameArea.clientHeight)
					rightpad.style.top = `${rightpad.offsetTop + padSpeeed}px`;
				break;
		}
	});

}

function playPong(){
	const ball = document.getElementById("ball") as HTMLDivElement;
    const gameArea = document.getElementById("game-area") as HTMLDivElement;
	const leftpad = document.getElementById("leftpad") as HTMLDivElement;
	const rightpad = document.getElementById("rightpad") as HTMLDivElement;

	if (!ball || !gameArea || !leftpad || !rightpad || !gameStarted)
		return ;

	let x = gameArea.clientWidth / 2;
	let y = gameArea.clientHeight / 2;
	let dx = 6;
	let dy = 6;

	function moveBall(){
        if (x <= 0 || x + ball.clientWidth >= gameArea.clientWidth)
            dx = 0;
        if (y <= 0 || y + ball.clientWidth >= gameArea.clientHeight)
            dy *= -1;
        if ((y <= leftpad.offsetTop + leftpad.offsetHeight && y >= leftpad.offsetTop) &&  (x <= leftpad.offsetLeft + leftpad.clientWidth && dx < 0))
            dx = (dx * -1) + 2;
        if ((y <= rightpad.offsetTop + rightpad.offsetHeight && y >= rightpad.offsetTop) && (x + ball.clientWidth >= rightpad.offsetLeft && dx > 0))
            dx = (dx * -1) - 2;
		if (dx >= 15)
			dx = 15;
		else if (dx <= -15)
			dx = -15;
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
