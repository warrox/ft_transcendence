import { PongNode } from "../lib/PongNode";
import { Div, Link } from "../lib/PongFactory";
import { linkCss } from "../styles/cssFactory";

export function Navbar(): PongNode<any> {
	return Div({
		class: "top-0 left-0 w-full z-50 bg-black border-gray-200"
	}, [
		Div({
			class: "max-w-screen-xl flex flex-wrap items-center justify-around mx-auto p-4"
		}, [
			Div({}, [linkFn("/home", "Home", linkCss)]),
			Div({}, [linkFn("/register", "Register", linkCss)]),
			Div({}, [linkFn("/login", "Login", linkCss)]),
			Div({}, [linkFn("/game", "Game", linkCss)]),
		])
	]);
}

export function linkFn(href: string, text: string, css: string): PongNode<any> {
	return Link({ href, class: css}, [text]);
}