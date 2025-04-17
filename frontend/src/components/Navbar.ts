import { PongNode } from "../lib/PongNode";
import { Div, Link } from "../lib/PongFactory";
import { linkCss } from "../styles/cssFactory";

export function Navbar(): PongNode<any> {
	return Div({
		class: "bg-white border-gray-200 dark:bg-gray-900"
	}, [
		Div({
			class: "max-w-screen-xl flex flex-wrap items-center justify-around mx-auto p-4"
		}, [
			Div({}, [linkFn("/home", "Home", linkCss)]),
			Div({}, [linkFn("/about", "About", linkCss)]),
			Div({}, [linkFn("/register", "Register", linkCss)]),
			Div({}, [linkFn("/login", "Login", linkCss)]),
			Div({}, [linkFn("/game", "Game", linkCss)]),
		])
	]);
}

export function linkFn(href: string, text: string, css: string): PongNode<any> {
	return Link({ href, class: css}, [text]);
}