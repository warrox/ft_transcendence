import { PongNode } from "../lib/PongNode";
import { Div, UList, Li, Span } from "../lib/PongFactory";
import { rerender } from "../router/router";
import { MeData } from "./Home";
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

let userGameStats: GameStats[] | null = null;
let nameUser: NameUser | null = null;

interface NameUser {
	name: string;
}

interface GameStats {
	id: number;
	user_id: number;
	result: "win" | "lose";
	guest_name: string;
	game_date: string;
	score: string;
}

export function Dashboard(): PongNode<any> {
	// Récupération des stats de jeu
	const fetchUserGameStats = () => {
		if (userGameStats !== null) return;

		fetch("/api/getGameScore", { credentials: "include" })
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

	// Récupération du nom utilisateur
	const fetchName = () => {
		if (nameUser !== null) return;

		fetch("/api/me", { credentials: "include" })
			.then((res) => {
				if (!res.ok) throw new Error("/api/me: Failed");
				return res.json();
			})
			.then((data: MeData) => {
				nameUser = { name: data.name };
				rerender();
			})
			.catch((e) => console.error(e));
	};

	fetchName();
	fetchUserGameStats();

	const gameElements: PongNode<any>[] = [];

	// Calculs et préparation des données
	const scores: [number, number][] = [];
	const winCount = userGameStats?.filter((g) => g.result === "win").length || 0;
	const loseCount = userGameStats?.filter((g) => g.result === "lose").length || 0;
	const totalGames = userGameStats?.length || 0;

	const streaks: number[] = [];
	let currentStreak = 0;

	const opponentMap: { [key: string]: number } = {};

	userGameStats?.forEach((game) => {
		let tuple: [number, number] = [0, 0];
		let i = 0;
		for (let s of game.score.split(" ")) {
			tuple[i++] = parseInt(s);
		}
		scores.push(tuple);

		if (game.result === "win") {
			currentStreak++;
		} else {
			streaks.push(currentStreak);
			currentStreak = 0;
		}

		opponentMap[game.guest_name] = (opponentMap[game.guest_name] || 0) + 1;
	});
	streaks.push(currentStreak);

	const totalPlayerScore = scores.reduce((acc, cur) => acc + cur[0], 0);
	const winRate = totalGames > 0 ? ((winCount / totalGames) * 100).toFixed(1) : "0";
	const winLoseRatio = loseCount > 0 ? (winCount / loseCount).toFixed(2) : "∞";
	const topOpponent = Object.entries(opponentMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

	if (userGameStats) {
		for (const game of userGameStats) {
			gameElements.push(
				Div(
					{
						class:
							"font-orbitron w-full mb-2 px-4 py-2 border border-white border-opacity-20 rounded-md text-sm text-center",
					},
					[
						Span({}, [`#${game.id ?? "?"}`]),
						Span({ class: "mx-4" }, [`${nameUser?.name ?? "?"} | ${game.guest_name ?? "?"}`]),
						Span({ class: "mx-4" }, [game.score ?? "?"]),
						Span(
							{
								class: `mx-4 ${
									game.result === "win"
										? "text-green-400"
										: game.result === "lose"
										? "text-yellow-400"
										: "text-white"
								}`,
							},
							[game.result ?? "?"]
						),
						Span({ class: "mx-4" }, [game.game_date ?? "?"]),
					]
				)
			);
		}
	} else {
		gameElements.push(Span({}, ["Loading..."]));
	}

	function getDonutClass(percent: number): string {
		const safePercent = Math.max(0, Math.min(100, Math.round(percent)));
	return `bg-donut-${safePercent}`;
}


	function Donut({ percent }: { percent: number }): PongNode<any> {
		const donutClass = getDonutClass(percent);

		return Div(
			{
				class: `relative w-56 h-56 rounded-full flex items-center justify-center ${donutClass}`,
			},
			[
				Div({
					class:
						"absolute w-40 h-40 bg-gray-700 rounded-full flex items-center justify-center",
				}, [
					Span({
						class:
							"text-white text-4xl font-orbitron font-bold select-none",
					}, [`${percent.toFixed(1)} %`]),
				]),
			]
		);
	}
	const progressPercent = parseFloat(winRate);

return Div({ class: areaCss }, [
	UList(
		{ class: circlesCss },
		[
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
		]
	),
	Div({ class: `${WrapperCss} ${backgroundCss} absolute top-0 left-0 w-full h-full z-[-1]` }),

	Div(
		{ class: "flex flex-row min-h-screen text-white font-orbitron gap-6 px-4 justify-center items-center" },
		[
			// === Colonne GAUCHE ===
			Div(
				{ class: "relative z-10 w-1/3 flex flex-col justify-center items-center p-4" },
				[
					Span({ class: neonTitleCss + " mb-4 text-3xl" }, ["Statistics"]),
					Div(
						{
							class:
								"bg-gray-600 bg-opacity-70 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-6",
						},
						[
							Div(
								{ class: "text-center" },
								[
									Span({ class: "text-xs text-gray-400 uppercase tracking-widest" }, ["Total parties jouées"]),
									Span({ class: "text-4xl font-bold mt-1 block" }, [String(totalGames)]),
								]
							),
							Div(
								{ class: "text-center" },
								[
									Span({ class: "text-xs text-gray-400 uppercase tracking-widest" }, ["Nombre de points marqués"]),
									Span({ class: "text-4xl font-bold mt-1 block" }, [String(totalPlayerScore)]),
								]
							),
							Div(
								{ class: "text-center" },
								[
									Span({ class: "text-xs text-gray-400 uppercase tracking-widest" }, ["Taux de victoire (%)"]),
									Span({ class: "text-4xl font-bold mt-1 block" }, [winRate]),
								]
							),
							Div(
								{ class: "text-center" },
								[
									Span({ class: "text-xs text-gray-400 uppercase tracking-widest" }, ["Série de victoires la plus longue"]),
									Span({ class: "text-4xl font-bold mt-1 block" }, [String(Math.max(...streaks))]),
								]
							),
							Div(
								{ class: "text-center" },
								[
									Span({ class: "text-xs text-gray-400 uppercase tracking-widest" }, ["Ratio défaites/victoires"]),
									Span({ class: "text-4xl font-bold mt-1 block" }, [winLoseRatio]),
								]
							),
							Div(
								{ class: "text-center" },
								[
									Span({ class: "text-xs text-gray-400 uppercase tracking-widest" }, ["Ami le plus affronté"]),
									Span({ class: "text-4xl font-bold mt-1 block" }, [topOpponent]),
								]
							),
						]
					),
				]
			),
			// === Donut au MILIEU ===
Div(
  { class: "relative z-20 w-64 h-64 text-center" }, // centrage horizontal du texte
  [
    Span({ class: neonTitleCss + " mb-4 text-3xl block" }, ["% de victoire"]), // block pour prendre toute la largeur
    Div(
      { class: "mx-auto" }, // pour centrer le donut
      [Donut({ percent: progressPercent })]
    ),
  ]
),

			// === Colonne DROITE ===
			Div(
				{ class: "relative z-10 w-1/3 flex flex-col items-center justify-center p-4" },
				[
					Span({ class: neonTitleCss + " mb-4 text-3xl" }, ["Score"]),
					Div(
						{
							class:
								"relative mt-8 text-left bg-gray-600 bg-opacity-40 rounded-xl p-6 w-full max-w-xl shadow-xl max-h-[66rem] overflow-y-auto",
						},
						[...gameElements]
					),
				]
			),
		]
	),
]);


}
