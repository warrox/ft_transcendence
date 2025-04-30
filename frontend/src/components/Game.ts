import { Div, Button, P, Span } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router"
import { t } from "i18next";
import i18n from "i18next";

var playerCount = 1;

export function Game(): PongNode<any> {
	setTimeout(() => startPongBall(), 0);

	return Div({ class: "flex flex-col justify-around items-center min-h-screen p-5 bg-black" }, [
			Span({ class: "block font-orbitron md:text-5xl text-yellow-400" }, [t("game.never_play")]),
			Span({ class: "block font-orbitron md:text-3xl text-yellow-400" }, [t("game.choose_map")]),
			
			//PlayerSelector(),
			Button({
				id: "Select-map",
				class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded"
			}, [t("game.select_map")]),
			Div({ id: "game-area", class: "relative w-[600px] h-[400px] bg-zinc-900 overflow-hidden" }, [
				Div({ id: "ball", class: "absolute w-[20px] h-[20px] bg-yellow-400 rounded-full" }),
				Div({id: "leftpad", class:"absolute w-[15px] h-[80px] bg-yellow-400 rounded-full left-[5px] top-[160px]"}),
				Div({id: "rightpad", class:"absolute w-[15px] h-[80px] bg-yellow-400 rounded-full left-[580px] top-[160px]"})
			]),
			Div({ class: "flex flex-col justify-around items-center h-30"}, [
				Span({ class: "block font-orbitron md:text-2xl text-yellow-400" }, [t("game.solo_friends")]),
				Div({ class: "flex justify-between w-90"}, [
					Button({id: "sgplayerButton",
						class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded"},
						[t("game.single_player")]),
					Button({id: "mgplayerButton",
						class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded"},
						[t("game.multi_player")]),
				]),
			]),
	]);
}

function startPongBall(){
	const ball = document.getElementById("ball") as HTMLDivElement;
	const gameArea = document.getElementById("game-area") as HTMLDivElement;

	if (!ball || !gameArea)
		return ;

	let x = 100;
	let y = 100;
	let dx = 8;
	let dy = 8;

	const areaWidth = gameArea.clientWidth;
	const areaHeight = gameArea.clientHeight;
	const ballSize = ball.clientWidth;

	function moveBall(){
		x += dx;
		y += dy;
		if (x <= 0 || x + ballSize >= areaWidth)
			dx *= -1;
		if (y <= 0 || y + ballSize >= areaHeight)
			dy *= -1;
		if ((y <= 160 && y >= 240) && (x <= 20))
			dx *= -1;
		if ((y >= 160 && y <= 240) && (x + ballSize >= areaWidth - 20))
			dx *= -1;
		if (y + ballSize >= 160 && y + ballSize - dy <= 160 && (x + ballSize >= areaWidth - 20 || x <= 20))
			dy *= -1;
		if (y + ballSize >= 160 && y + ballSize - dy <= 160 && (x + ballSize >= areaWidth - 20 || x <= 20))
			dy *= -1;
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
