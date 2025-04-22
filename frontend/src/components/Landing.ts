import { H1Node, PongNode } from "../lib/PongNode";
import { Div, Image, Button, H1, Span, RawHTML } from "../lib/PongFactory";
import { linkFn } from "./Navbar";
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
			Image({ id: "img", src: "/assets/42logoT.png", class: "h-10" }),
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
		class: "relative min-h-screen bg-gray-950"
	}, [
		Div({
			class: "relative z-10 container mx-auto px-4 py-20"
		}, [

			Div({
				class: "text-center mb-16"
			}, [
				H1({ class: "font-bold leading-snug mb-8 animate-fade-down" }, 
				[
					Span({ class: "block font-orbitron md:text-7xl text-yellow-400" }, ["Play Pong."]),
					Span({ class: "block font-orbitron md:text-7xl text-white" }, ["Have Fun. Build table tennis skills."]),
					Span({ class: "block md:text-3xl text-gray-300 pt-10 mb-8"}, ["Level up your skills with game and tournament."]),
					Button({
						id: "playButton",
						class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 px-6 border-b-4 border-yellow-700 hover:border-yellow-500 rounded text-lg"
					}, [linkFn("/game", "➡️ Start Playing", "")]),
					Span({class: "block md:text-xl text-gray-500 pt-4"}, ["Discover why 42 developers love Transcendence. 100% free."]),
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
				class: "flex-wrap justify-center  mt-40",
			}, [
				H1({ class: "font-bold text-white font-orbitron md:text-5xl animate-rotate-x animate-delay-1000"}, ["Play on 42 + maps"]),
				H1({ class: "font-bold text-white font-orbitron md:text-1xl"}, ["Show off your Pong skills in a tournament or brush up your fingers while destroying an AI opponent."])
			])
		])
	]);
}

export function Landing() : PongNode<any> {
	return Div({}, [
		navLanding(),
		main(),
		// main()
	]);
}
