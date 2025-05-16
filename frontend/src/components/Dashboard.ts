import { PongNode } from "../lib/PongNode";
import { Div, UList, Li, Span } from "../lib/PongFactory";
import {
	areaCss,
	circlesCss,
	circle1Css,
	circle2Css,
	circle3Css,
	circle4Css,
	circle5Css,
	circle6Css,
	circle7Css,
	circle8Css,
	circle9Css,
	circle10Css,
	WrapperCss,
	backgroundCss,
	neonTitleCss,
} from "../styles/cssFactory";

import { navigateTo, rerender } from "../router/router";
import { reloadResources, t } from "i18next";
import i18n from "i18next";
import { log } from "console";

let userGameStats: GameStats[] | null = null;

interface GameStats {
	id: number;
	user_id: number;
	result: "win" | "lose";
	guest_name: string;
	game_date: string;
	score: string;
}

export function Dashboard(): PongNode<any> {
	const fetchUserGameStats = () => {
		if (userGameStats !== null) return;

		fetch("/api/getGameScore", {
			credentials: "include",
		})
			.then((res) => {
				if (!res.ok) throw new Error("/api/getGameScore: Failed");
				return res.json();
			})
			.then((data: GameStats[]) => {
				userGameStats = data;
				rerender();
			})
			.catch((e) => console.error(e));
	};

	fetchUserGameStats();

	const gameElements: PongNode<any>[] = [];

	const scores = new Array<[number, number]>;
	userGameStats!.forEach(game => {
		let tuple: [number, number] = [0, 0];
		let i = 0;
		for (let s of game.score.split(" ")) {
			tuple[i++] = parseInt(s)
		}
		scores.push(tuple);
	});

	console.log("Les scores:", scores);

	const totalPlayerScore = scores.reduce<number>(
		(acc, current) => acc += current[0], 0
	);

	//reduce
	//forEach
	//map
	//filter
	
	console.log("Player score:", totalPlayerScore);

	if (userGameStats) {
		for (let i = 0; i < userGameStats.length; i++) {
			const game = userGameStats[i];
			gameElements.push(
				Div({ class: "mb-6 p-4 border border-white border-opacity-20 rounded-md" }, [
				Span({ class: "block mb-2" }, [`ID: ${game.id ?? "?"}`]),
				Span({ class: "block mb-2" }, [`User ID: ${game.user_id ?? "?"}`]),
				Span({ class: "block mb-2" }, [`Result: ${game.result ?? "?"}`]),
				Span({ class: "block mb-2" }, [`Guest Name: ${game.guest_name ?? "?"}`]),
				Span({ class: "block mb-2" }, [`Game Date: ${game.game_date ?? "?"}`]),
				Span({ class: "block mb-2" }, [`Score: ${game.score ?? "?"}`]),
				])
			);
		}
	} else {
		gameElements.push(Span({}, ["Loading..."]));
	}

	return Div({ class: areaCss }, [
		UList({ class: circlesCss }, [
			Li({ class: circle1Css }),
			Li({ class: circle2Css }),
			Li({ class: circle3Css }),
			Li({ class: circle4Css }),
			Li({ class: circle5Css }),
			Li({ class: circle6Css }),
			Li({ class: circle7Css }),
			Li({ class: circle8Css }),
			Li({ class: circle9Css }),
			Li({ class: circle10Css }),
		]),
		Div({ class: `${WrapperCss} ${backgroundCss} absolute top-0 left-0 w-full h-full z-[-1]` }),
		Div({ class: "flex flex-col items-center justify-center min-h-screen text-white p-8" }, [
			Span({ class: neonTitleCss }, ["Dashboard"]),
			Div({ class: "mt-8 text-left bg-gray-600 bg-opacity-40 rounded-xl p-6 w-full max-w-xl shadow-xl" }, gameElements)
		])
	]);
}
