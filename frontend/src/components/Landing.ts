import { H1Node, PongNode } from "../lib/PongNode";
import { Div, P, Image, Button, H1, H2 } from "../lib/PongFactory";
import { linkFn } from "./Navbar";
import { linkCss } from "../styles/cssFactory";
import { rerender } from "../router/router";


let navExpanded = false;


function navLanding() : PongNode<any> {

	const toggleNav = () => {
		navExpanded = !navExpanded;
		rerender();
	}

	// const navButtonClass = "w-full text-2xl py-4 px-6 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded mb-4 transition-all";

	return Div({}, [
		Div({
			class: "fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black shadow-md"
		}, [
			Image({ id: "img", src: "/assets/42logo.png", class: "h-10" }),
			Div({ class: "flex gap-4"}, [
				// Button({
				// 	id: "burgerButton",
				// 	onClick: toggleNav,
				// 	class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded"
				// }, ["≡"]),
				Button({
					id: "loginButton",
					class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded",
				}, [linkFn("/login", "Login", "")]),
				Button({
					id: "registerButton",
					class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded"
				}, [linkFn("/register", "Register", "")])
			])
		]),

		// Div({
		// 	class: `overflow-hidden transition-all duration-500 ease-in-out ${
		// 		navExpanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
		// 	} bg-black flex flex-col items-center px-4`
		// }, navExpanded ? [
		// 	Button({
		// 		id: "button1",
		// 		onClick: () => {
		// 			navExpanded = false;
		// 		},
		// 		class: navButtonClass,
		// 	}, [linkFn("/login", "Login", "")]),

		// 	Button({
		// 		id: "button2",
		// 		onClick: () => {
		// 			navExpanded = false;
		// 			linkFn("/register", "Register", "");
		// 		},
		// 		class: navButtonClass,
		// 	}, [linkFn("/login", "Register", "")])
		// ] : [])
	]);
}

function main(): PongNode<any> {
	return Div({
		class: "flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center px-4"
	}, [
		H1({
			class: "text-4xl md:text-6xl font-bold text-yellow"
		}, ["Jouez et devenez un meilleur pongiste sur Transcendence."]),
		H2({
			class: "text-4xl md:text-6xl font-bold text-yellow",
		}, ["Améliorez vos compétences en ping-pong avec des parties a gogo et des challenges."])
	]);
}




export function Landing() : PongNode<any> {
	return Div({}, [
		navLanding(),
		main(),
		// main()
	]);
}
