import { PongNode } from "../lib/PongNode";
import { Button, Div, Link } from "../lib/PongFactory";
import { linkCss, playButtonLangDarkCss, playButtonDarkCss } from "../styles/cssFactory";
import { AuthStore } from "../stores/AuthStore";
import { navigateTo, rerender } from "../router/router";
import { t } from "i18next";
import i18n from "i18next";

export function linkFn(linkId: string, href: string, text: string, css: string): PongNode<any> {
	return Link({
		id: linkId,
		href,
		class: css,
		onClick: () => {
			navigateTo(href);
		}
	}, [text]);
}

function changeLanguageTo(lang: string) {
	i18n.changeLanguage(lang).then(() => {
	  // Sauvegarder la langue dans localStorage
	  localStorage.setItem('language', lang);
	  rerender();
	});
  }

export function Navbar(): PongNode<any> {
	const isLogged = AuthStore.isLoggedIn;

	const handleDisconnect = () => {
		fetch("/api/logout", {
			method: "GET",
			credentials: "include",
			headers: {
				'Content-Type': 'application/json',
			}
		})
			.then(res => {
				if (!res.ok)
					throw new Error(`HTTP error! Status: ${res.status}`);
				return res.text();
			})
			.then(body => {
				try {
					const parsedBody = JSON.parse(body);
					console.log("Déconnexion réussie :", parsedBody);
					setTimeout(() => {
						navigateTo('/home');
					}, 2000);
					rerender();
				} catch (e) {
					console.error("Erreur de parsing JSON :", e);
					rerender();
				}
			})
			.catch(e => console.error("Erreur :", e));
	};

	const languageButtons = Div({
		class: "flex gap-2"
	}, [
		Button({
			id: "lang-fr",
			onClick: () => changeLanguageTo("fr"),
			class: playButtonLangDarkCss
		}, ["🇫🇷"]),
		Button({
			id: "lang-en",
			onClick: () => changeLanguageTo("en"),
			class: playButtonLangDarkCss
		}, ["🇺🇸"]),
		Button({
			id: "lang-pt",
			onClick: () => changeLanguageTo("pt"),
			class: playButtonLangDarkCss
		}, ["🇵🇹"]),
	]);

	return Div({
		class: "top-0 left-0 w-full z-50 bg-black border-gray-200"
	}, [
		Div({
			class: "max-w-screen-xl flex flex-wrap items-center justify-around mx-auto p-4"
		}, [
			...(!isLogged ? [
				linkFn("link1", "/", t("navbar.home"), linkCss),
				linkFn("link2", "/register", t("navbar.register"), linkCss),
				linkFn("link3", "/login", t("navbar.login"), linkCss),
			] : [
				linkFn("link4", "/home", t("navbar.home"), linkCss),
				linkFn("link5", "/game", t("navbar.game"), linkCss),
				Button({
					id: "logoutButton",
					onClick: handleDisconnect,
					class: playButtonDarkCss,
				}, [t("navbar.disconnect")]),
			]),
			languageButtons
		])
	]);
}
