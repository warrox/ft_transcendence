import { PongNode } from "../lib/PongNode";
import { Div, UList, Li, Span, Image, Button, RawHTML, Input } from "../lib/PongFactory";
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
	playButtonDarkCss,
	inputScaleCss
} from "../styles/cssFactory";
import { navigateTo, rerender } from "../router/router";

let userInfo: UserInfo | null = null;

interface UserInfo {
	login: string;
	surname: string;
	email: string;
	is_2FA: boolean;
}

interface MeData {
	id: number,
	is_2FA: boolean, 
	name: string,
	surname: string,
	email: string,
};

export function Home(): PongNode<any> {
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
					surname: data.surname,
					is_2FA: data.is_2FA,
				};
				rerender();
			})
			.catch((e) => console.error(e));
	};

	fetchUserInfo();

	const userLogin = userInfo ? userInfo.login : "Loading...";
	const userEmail = userInfo ? userInfo.email : "Loading...";
	const userSurname = userInfo ? userInfo.surname : "Loading...";
	const user2FAStatus = userInfo ? userInfo.is_2FA : false;

	const toggleLoginForm = () => {
		const loginInputContainer = document.getElementById('login-input-container');
		const confirmButtonContainer = document.getElementById('confirm-button-container');
	
		if (loginInputContainer && confirmButtonContainer) {
			const shouldShow = loginInputContainer.style.display === 'none' || loginInputContainer.style.display === '';
	
			loginInputContainer.style.display = shouldShow ? 'flex' : 'none';
			confirmButtonContainer.style.display = shouldShow ? 'flex' : 'none';
		}
	};
		
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
					Div({ class: `${cardBackCss} flex flex-col justify-start p-6` }, [
						// Partie haute (titre + image)
						Div({ class: "flex flex-col items-center mb-6" }, [ // <- Augmente l'espacement sous titre+img
							Span({ class: "text-xl font-bold" }, ["Informations"]),
							Image({ id: "infos_img", src: "../assets/infos.png", alt: "infos_img", class: "imageCenter w-20" })
						]),
						// Partie basse
						Div({ class: "flex flex-col flex-grow items-center" }, [
							Div({ class: "flex flex-col items-start w-full mt-3 mb-3" }, [ // <- Ajoute plus de haut ET bas
								Div({ class: "flex items-center mb-2" }, [
									Image({ id: "test", src: "../assets/login.png", alt: "login", class: "w-8 h-8 mr-2" }),
									Span({ class: "text-md" }, [userLogin]),
								]),
								Div({ class: "flex items-center mb-2" }, [
									Image({ id: "test1", src: "../assets/surname.png", alt: "surname", class: "w-8 h-8 mr-2" }),
									Span({ class: "text-md" }, [userSurname]),
								]),
								Div({ class: "flex items-center mb-2" }, [
									Image({ id: "test2", src: "../assets/email.png", alt: "email", class: "w-8 h-8 mr-2" }),
									Span({ class: "text-md" }, [userEmail]),
								]),
								Div({ class: "flex items-center mb-2" }, [
									Image({ id: "test3", src: "../assets/2fa.png", alt: "2fa", class: "w-8 h-8 mr-2" }),
									Span({ 
										class: `text-md font-semibold ${user2FAStatus ? 'text-green-400' : 'text-red-400'}`
									}, [user2FAStatus ? "Enabled" : "Disabled"]),
								]),
							]),
							// Bouton
							Div({ class: "flex justify-center w-full mt-1" }, [ // <- Rapproche le bouton
								Button({
									id: "test",
									class: `${playButtonDarkCss}`,
									onClick: toggleLoginForm,
								}, ["Change login"]),
							]),
							// Input
							// Input container
							Div({ id: "login-input-container", class: "hidden mt-4 w-full flex justify-center" }, [
								Input({
									id: "login-input",
									class: inputScaleCss,
									placeholder: "Enter new login",
								}),
							]),

							// Confirm button container
							Div({ id: "confirm-button-container", class: "hidden mt-3 w-full flex justify-center" }, [
								Button({
									id: "confirm-button",
									class: `${playButtonDarkCss}`,
									onClick: () => {
										// Tu peux ajouter ici la logique pour envoyer le nouveau login
										const inputElement = document.getElementById('login-input') as HTMLInputElement;
										if (inputElement && inputElement.value.trim() !== '') {
											console.log('New login:', inputElement.value); // ici envoyer via fetch par ex
										}
										toggleLoginForm;
									}
								}, ["Confirm"]),
							]),
						]),
					])
				])
			]),
			// Carte 2 : Game
			Div({ class: cardFlipCss }, [
				Div({ class: cardInnerCss }, [
					Div({ class: cardFrontCss }, [
						Span({ class: neonTitleCss }, ["Game"]),
						Image({ id: "game_img", src: "../assets/pong.png", alt: "game_img", class: "imageCenter" })
					]),
					Div({ class: `${cardBackCss} flex flex-col items-center justify-center text-center p-6` }, [
						RawHTML(`
							<video autoplay muted loop playsinline class="w-full h-auto mb-4">
								<source src="/assets/backgroundL2.mp4" type="video/mp4" />
								Your browser does not support the video tag.
							</video>
						`),
						Span({}, ["Pong like you’ve never played it before..."]),
						Div({ class: "mt-10 flex justify-center" }, [
							Button({
								id: "play_button",
								class: playButtonDarkCss,
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
					Div({ class: cardBackCss }, [
						Span({}, ["Card 3 Back"])
					])
				])
			]),
			// Carte 4 : Settings
			Div({ class: cardFlipCss }, [
				Div({ class: cardInnerCss }, [
					Div({ class: cardFrontCss }, [
						Span({ class: neonTitleCss }, ["Settings"]),
						Image({ id: "settings_img", src: "../assets/settings.png", alt: "settings_img", class: "imageCenter" })
					]),
					Div({ class: cardBackCss }, [
						Span({}, ["Card 4 Back"])
					])
				])
			])
		])
	]);
}
