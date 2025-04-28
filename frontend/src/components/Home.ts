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
	cardsContainerCss,
	cardFlipCss,
	cardInnerCss,
	cardFrontCss,
	cardBackCss,
	neonTitleCss,
	playButtonDarkCss
} from "../styles/cssFactory";
import { navigateTo, rerender } from "../router/router";

// Initialisation de userInfo comme étant null au départ
let userInfo: UserInfo | null = null;

// Définition explicite du type pour `userInfo`
interface UserInfo {
	login: string;
	email: string;
}

interface MeData {
	id: number,
	is_2FA: boolean, 
	name: string,
	surname: string,
	email: string,
};

export function Home(): PongNode<any> {
	// Fonction pour récupérer les infos de l'utilisateur
	const fetchUserInfo = () => {
		if (userInfo !== null) return;

		fetch("/api/me", {
			credentials: "include",
		})
			.then((res) => {
				if (!res.ok) throw new Error("/api/me: Failed");
				return res.json();
			})
			.then((data: MeData) => {
				userInfo = {
					login: data.name,
					email: data.email,
				};
				rerender();
			})
			.catch((e) => console.error(e));
	}
	
	fetchUserInfo();
	const userLogin = userInfo ? userInfo.login : "Loading...";
	const userEmail = userInfo ? userInfo.email : "Loading...";
	// Appel de la fonction lors du montage du composant
	
	// Affichage conditionnel selon la présence des données dans userInfo

	// Structure de retour
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
		Div({ class: cardsContainerCss }, [
			// Carte 1 : Profil
			Div({ id: "first", class: cardFlipCss }, [
				Div({ id: "second", class: cardInnerCss }, [
					Div({ id: "third", class: cardFrontCss }, [
						Span({ class: neonTitleCss }, ["Profil"]),
						Image({ id: "profil_img", src: "../assets/profil.png", alt: "profil_img", class: "imageCenter" })
					]),
					Div({ class: `${cardBackCss} flex flex-col justify-between text-center p-6` }, [
						// Partie haute (titre + image)
						Div({ class: "flex flex-col items-center" }, [
							Span({ class: "text-xl font-bold mb-4" }, ["User Info"]),
							Image({ id: "infos_img", src: "../assets/infos.png", alt: "infos_img", class: "imageCenter w-20" })
						]),
						// Partie basse (login + email)
						Div({ class: "flex flex-col items-center justify-center flex-grow" }, [
							Span({ class: "text-md mb-2" }, [userLogin]),
							Span({ class: "text-md" }, [userEmail])
						])
					])
				])
			]),
			// Carte 2 : Game (avec vidéo et bouton)
			Div({ class: cardFlipCss }, [
				Div({ class: cardInnerCss }, [
					Div({ class: cardFrontCss }, [
						Span({ class: neonTitleCss }, ["Game"]),
						Image({ id: "game_img", src: "../assets/pong.png", alt: "game_img", class: "imageCenter" })
					]),
					// Contenu du dos de la carte centré avec Flexbox
					Div({ class: `${cardBackCss} flex flex-col items-center justify-center text-center p-6` }, [
						// Vidéo entre le titre et le bouton
						RawHTML(`
							<video autoplay muted loop playsinline class="w-full h-auto mb-4">
								<source src="/assets/backgroundL2.mp4" type="video/mp4" />
								Your browser does not support the video tag.
							</video>
						`),
						// Texte entre la vidéo et le bouton
						Span({}, ["Pong like you’ve never played it before..."]),
						
						// Bouton centré
						Div({ class: "mt-4 flex justify-center" }, [
							Button({
								id: "play_button",
								class: playButtonDarkCss,
								// onClick: () => console.log("Play button clicked"),
								onClick: () => navigateTo("/game"),
							}, ["Let's play"])
						])
					])
				])
			]),
			// Carte 3 : Dashboard
			Div({ class: cardFlipCss }, [
				Div({ class: cardInnerCss }, [
					Div({ class: cardFrontCss }, [
						Span({ class: neonTitleCss }, ["Dashboard"]),
						Image({ id: "dash_img", src: "../assets/dashboard.png", alt: "dash_img", class: "imageCenter" })
					]),
					Div({ class: cardBackCss }, [Span({}, ["Card 3 Back"])])
				])
			]),
			// Carte 4 : Settings
			Div({ class: cardFlipCss }, [
				Div({ class: cardInnerCss }, [
					Div({ class: cardFrontCss }, [
						Span({ class: neonTitleCss }, ["Settings"]),
						Image({ id: "settings_img", src: "../assets/settings.png", alt: "settings_img", class: "imageCenter" })
					]),
					Div({ class: cardBackCss }, [Span({}, ["Card 4 Back"])])
				])
			])
		])
	]);
}
