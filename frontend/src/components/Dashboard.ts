import { PongNode } from "../lib/PongNode";
import { Div, UList, Li, Span, Image, Button, RawHTML } from "../lib/PongFactory";
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
import { t } from "i18next";
import i18n from "i18next";

let userGameStats: GameStats | null = null;

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
			.then((data: GameStats) => {
				userGameStats = data;
				rerender();
			})
			.catch((e) => console.error(e));
	}

	fetchUserGameStats();

	const idGameStats = userGameStats ? userGameStats.id : "Loading...";
	const user_idGameStats = userGameStats ? userGameStats.user_id : "Loading...";
	const resultGameStats = userGameStats ? userGameStats.result : "Loading...";
	const guest_nameGameStats = userGameStats ? userGameStats.guest_name : "Loading...";
	const game_dateGameStats = userGameStats ? userGameStats.game_date : "Loading...";
	const scoreGameStats = userGameStats ? userGameStats.score : "Loading...";

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
		// Div({ class: `${WrapperCss} ${backgroundCss}` }),
		Div({ class: "flex flex-col items-center justify-center min-h-screen text-white p-8" }, [
			Span({ class: neonTitleCss }, ["Dashboard"]),
			Div({ class: "mt-8 text-left bg-gray-600 bg-opacity-40 rounded-xl p-6 w-full max-w-xl shadow-xl" }, [
				Span({ class: "block mb-2" }, [`ID: ${idGameStats}`]),
				Span({ class: "block mb-2" }, [`User ID: ${user_idGameStats}`]),
				Span({ class: "block mb-2" }, [`Result: ${resultGameStats}`]),
				Span({ class: "block mb-2" }, [`Guest Name: ${guest_nameGameStats}`]),
				Span({ class: "block mb-2" }, [`Game Date: ${game_dateGameStats}`]),
				Span({ class: "block mb-2" }, [`Score: ${scoreGameStats}`]),
			])
		])
	]);
}