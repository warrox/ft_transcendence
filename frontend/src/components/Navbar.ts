import { PongNode } from "../lib/PongNode";
import { Div, Link } from "../lib/PongFactory";

export function Navbar(): PongNode<any> {
	return Div({
		class: "bg-white border-gray-200 dark:bg-gray-900"
	}, [
		Div({
			class: "max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
		}, [
			Div({class: "flex items-center space-x-3 rtl:space-x-reverse" }, [link("/", "Home", "self-center text-2xl font-semibold whitespace-nowrap dark:text-white")]),
			Div({}, [link("/about", "About", "self-center text-2xl font-semibold whitespace-nowrap dark:text-white")]),
			Div({}, [link("/register", "Register", "self-center text-2xl font-semibold whitespace-nowrap dark:text-white")]),
		])
	]);
}

function link(href: string, text: string, css: string): PongNode<any> {
	return Link({ href, class: css}, [text]);
}