import { PongNode } from "../lib/PongNode";
import { Div, UList, Li, Span, Image } from "../lib/PongFactory"
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
	// cardCss,
	// cardNeonHoverCss
	cardFlipCss,
	cardInnerCss,
	cardFrontCss,
	cardBackCss,
	neonTitleCss
} from "../styles/cssFactory";

// import "../assets/profil.png";

export function Home(): PongNode<any> {
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
			// Carte 1 avec image sous Profil
			Div({ class: cardFlipCss }, [
				Div({ class: cardInnerCss }, [
					Div({ class: cardFrontCss }, [
						Span({ class: neonTitleCss }, ["Profil"]),
						Image({ id: "profil_img", src: "../assets/profil.png", alt: "profil_img", class: "imageCenter" })
					]),
					Div({ class: cardBackCss }, [Span({}, ["Card 1 Back"])])
				])
			]),
			// Carte 2
			Div({ class: cardFlipCss }, [
				Div({ class: cardInnerCss }, [
					Div({ class: cardFrontCss }, [
						Span({ class: neonTitleCss }, ["Game"]),
						Image({ id: "game_img", src: "../assets/pong.png", alt: "game_img", class: "imageCenter" })
					]),
					Div({ class: cardBackCss }, [Span({}, ["Card 2 Back"])])
				])
			]),
			// Carte 3
			Div({ class: cardFlipCss }, [
				Div({ class: cardInnerCss }, [
					Div({ class: cardFrontCss }, [
						Span({ class: neonTitleCss }, ["Dashboard"]),
						Image({ id: "dash_img", src: "../assets/dashboard.png", alt: "dash_img", class: "imageCenter" })
					]),
					Div({ class: cardBackCss }, [Span({}, ["Card 3 Back"])])
				])
			]),
			// Carte 4
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

