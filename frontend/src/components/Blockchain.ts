import { Div, UList, Li, P } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { areaCss } from "../styles/cssFactory";
import {rerender} from "../router/router"
import { AuthStore } from '../stores/AuthStore.ts';

import { t } from "i18next";
import i18n from "i18next";

type Score = {
	id: number;
	date: string;
	won: boolean;
	guest_name: string;
};

let scores: Score[] = [];
let hasFetched = false;
let lastFetchedUserId: string | null = null;

function formatDateFR(isoDate: string): string {

	const date = new Date(isoDate);
	return date.toLocaleString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function getId(){
	if (AuthStore.instance.user){
		return AuthStore.instance.user.id;
	}
	return "-1";
}

const fetchBlockchainData = () => {
	fetch("/api/getBlockchain", {
		method: "GET",
		credentials: "include",
	})
	.then(async res => {
		if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
		const text = await res.text();
		console.log("Réponse brute du serveur :", text);

		try {
			const parseBody = JSON.parse(text);
			console.log("Response parsed from JSON :", parseBody);

			lastFetchedUserId = getId();

			scores = parseBody.score.map(([id, date, won, guest_name]: [string, string, boolean, string]) => ({
				id: parseInt(id),
				date,
				won,
				guest_name,
			}));	
			rerender();
		} catch (e) {
			console.log("Error parsing JSON: ", e);
		}
	})
	.catch(err => {
		console.error("Erreur HTTP : ", err);
	});
};


export  function Blockchain(): PongNode<any> {
	
	if(hasFetched === false  || getId() != lastFetchedUserId)
		fetchBlockchainData();
	hasFetched = true;
	
	return Div({ class: `${areaCss} min-h-screen bg-yellow-400 flex flex-col items-center pt-20` }, [
		P({ class: "text-3xl font-bold mb-6" }, [t("blockchain.game_history")]),

		Div({ class: "w-full max-w-4xl bg-yellow-300 rounded-lg p-6 shadow-md" }, [
			UList({ class: "grid grid-cols-3 font-semibold border-b border-gray-700 pb-2 mb-2 text-center" }, [
				Li({}, [t("blockchain.date")]),
				Li({}, [t("blockchain.opponent")]),
				Li({}, [t("blockchain.result")]),
			]),

			...scores.map((score) =>
				UList({ class: "grid grid-cols-3 text-center py-2 border-b border-gray-500" }, [	
					Li({}, [formatDateFR(score.date)]),
					Li({}, [score.guest_name]),
					Li({}, [score.won ? "Win" : "Loose"]),
				])
			),
		]),
	]);
}
