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

export function Dashboard(): PongNode<any> {

	let gameInfoContent: PongNode<any>[] = [Span({ class: "text-white" }, ["Chargement..."])];

	// Lancer le fetch dès le rendu initial
	fetch("/api/getGameScore", {
		credentials: "include",
	})
		.then(res => {
			console.log(res); // Log la réponse complète ici
			return res.json(); // Ensuite, on continue avec la conversion en JSON
		})
		.then(data => {
			console.log(data);
			if (data.error) {
				gameInfoContent = [Span({ class: "text-red-500" }, [data.error])];
			} else {
				gameInfoContent = [
					Span({}, [`Résultat : ${data.result}`]),
					RawHTML(`<br>`),
					Span({}, [`Adversaire : ${data.guest_name || "N/A"}`]),
					RawHTML(`<br>`),
					Span({}, [`Date : ${new Date(data.game_date).toLocaleString("fr-FR")}`]),
					RawHTML(`<br>`),
					Span({}, [`Score : ${data.score}`]),
				];
			}
			// rerender(); // Forcer la mise à jour de l'affichage
		})
		.catch(err => {
			console.error(err);
			gameInfoContent = [Span({ class: "text-red-500" }, ["Erreur lors du chargement"])];
			// rerender();
		});

	// Fonction qui renvoie le nœud de stats (reconstruit à chaque rerender)
	const gameInfoNode = (): PongNode<any> =>
		Div({ class: "text-center text-white mt-10" }, gameInfoContent);

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
		Div({ class: `${WrapperCss} ${backgroundCss}` }),
		Div({ id: "header", class: "absolute top-40 left-0 w-full flex justify-center" }, [
			Span({ class: `${neonTitleCss} text-7xl` }, ["Dashboard"]),
		]),
		Div({ class: "absolute top-[28rem] w-full flex justify-center" }, [
			gameInfoNode()
		]),
	]);
}