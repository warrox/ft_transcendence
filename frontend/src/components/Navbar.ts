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
			Div({class: "flex items-center space-x-3 rtl:space-x-reverse" }, [link("/", "Home", linkCss)]),
			Div({}, [link("/about", "About", linkCss)]),
			Div({}, [link("/register", "Register", linkCss)]),
			Div({}, [link("/login", "Login", linkCss)]),
			Div({}, [link("/game", "Game", linkCss)]),

		])
	]);
}

function link(href: string, text: string, css: string): PongNode<any> {
	return Link({ href, class: css}, [text]);
}