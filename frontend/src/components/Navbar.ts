import { PongNode } from "../lib/PongNode";
import { Div, Link } from "../lib/PongFactory";

export function Navbar(): PongNode<any> {
	return Div({
		style: "navbar"
	}, [
		Div({
			style: "nav-links"
		}, [
			Div({}, [link("/", "Home")]),
			Div({}, [link("/about", "About")]),
			Div({}, [link("/register", "Register")]),
		])
	]);
}

function link(href: string, text: string): PongNode<any> {
	return Link({ href, style: "link"}, [text]);
}