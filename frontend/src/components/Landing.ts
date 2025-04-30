import { PongNode } from "../lib/PongNode";
import { Div, Image, Button, H1, Span, RawHTML, P } from "../lib/PongFactory";
import { linkFn } from "./Navbar";
import { rerender } from "../router/router";
import { AuthStore } from "../stores/AuthStore";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { t } from "i18next";
import i18n from "i18next";

AOS.init({
	once: true,
	duration: 800,
	offset: 120,
});

function changeLanguageTo(lang: string) {
	i18n.changeLanguage(lang).then(() => rerender());
}

function navLanding(): PongNode<any> {
	return Div({}, [
		Div({
			class: "fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black shadow-md"
		}, [
			Image({ id: "img", src: "/assets/42logoT.png", class: "h-10" }),
			Div({ class: "flex gap-4"}, [
				// Boutons de langue FR / EN / PT
				Button({
					id: "lang-fr",
					onClick: () => changeLanguageTo("fr"),
					class: "bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded"
				}, ["Français"]),
				Button({
					id: "lang-en",
					onClick: () => changeLanguageTo("en"),
					class: "bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded"
				}, ["English"]),
				Button({
					id: "lang-pt",
					onClick: () => changeLanguageTo("pt"),
					class: "bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded"
				}, ["Português"]),
				
				Button({
					id: "loginButton",
					class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded",
				}, [linkFn("loginLink", "/login", t("landing.login"), "")]),
				
				Button({
					id: "registerButton",
					class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded"
				}, [linkFn("registerLink", "/register", t("landing.register"), "")])
			])
		])
	]);
}

function main(): PongNode<any> {
	const isLogged = AuthStore.isLoggedIn;

	return Div({
		class: "relative min-h-screen bg-gray-950"
	}, [
		Div({
			class: "relative z-10 container mx-auto px-4 py-20"
		}, [
			Div({
				class: "text-center mb-16"
			}, [
				H1({ class: "font-bold leading-snug mb-8 animate-fade-down" }, [
					Span({ class: "block font-orbitron md:text-7xl text-yellow-400" }, [t("landing.play_pong")]),
					Span({ class: "block font-orbitron md:text-7xl text-white" }, [t("landing.have_fun")]),
					Span({ class: "block md:text-3xl text-gray-300 pt-10 mb-8" }, [t("landing.lvl_up")]),
					Button({
						id: "playButton",
						class: "font-orbitron bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 px-6 border-b-4 border-yellow-700 hover:border-yellow-500 rounded text-lg"
					}, [
						isLogged
							? linkFn("linkGame", "/game", t("landing.start_playing"), "")
							: linkFn("linkLoginFromLanding", "/login", t("landing.start_playing"), "")
					]),
					Span({ class: "block md:text-xl text-gray-500 pt-4" }, [t("landing.why_42")]),
				]),
			]),

			Div({
				class: "mt-20 animate-fade-up animate-delay-[300ms] mx-auto max-w-4xl rounded-xl overflow-hidden shadow-2xl"
			}, [
				RawHTML(`
					<video autoplay muted loop playsinline class="w-full h-auto">
						<source src="/assets/backgroundL2.mp4" type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				`)
			]),

			Div({
				class: "flex flex-col items-center mt-40",
			}, [
				H1({
					class: "font-bold text-white font-orbitron md:text-5xl",
					"data-aos": "flip-down",
					"data-aos-delay": "200"
				}, [t("landing.multi_map")]),

				P({ class: "font-bold text-white font-orbitron md:text-xl text-center mt-20" }, [t("landing.show_off")])
			])
		])
	]);
}

export function Landing(): PongNode<any> {
	return Div({}, [
		navLanding(),
		main(),
	]);
}
