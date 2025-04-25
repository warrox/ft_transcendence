import { PongNode } from "../lib/PongNode";
import { Div, Link } from "../lib/PongFactory";
import { linkCss } from "../styles/cssFactory";
import { AuthStore } from "../stores/AuthStore";

// export function Navbar(): PongNode<any> {
// 	const isLogged = AuthStore.isLoggedIn;
// 	return Div({
// 		class: "top-0 left-0 w-full z-50 bg-black border-gray-200"
// 	}, [
// 		Div({
// 			class: "max-w-screen-xl flex flex-wrap items-center justify-around mx-auto p-4"
// 		}, [
// 			linkFn("/home", "Home", linkCss),
// 			linkFn("/register", "Register", linkCss),
// 			linkFn("/login", "Login", linkCss),
// 			linkFn("/game", "Game", linkCss),
// 		])
// 	]);
// }

export function linkFn(href: string, text: string, css: string): PongNode<any> {
	return Link({ href, class: css}, [text]);
}

export function Navbar(): PongNode<any> {
	const isLogged = AuthStore.isLoggedIn;
	return Div({
		class: "top-0 left-0 w-full z-50 bg-black border-gray-200"
	}, [
		Div({
			class: "max-w-screen-xl flex flex-wrap items-center justify-around mx-auto p-4"
		}, [
			...(!isLogged ? [
				linkFn("/", "Home", linkCss),
				linkFn("/register", "Register", linkCss),
				linkFn("/login", "Login", linkCss),
			] : [
				linkFn("/home", "Home", linkCss),
				linkFn("/game", "Game", linkCss),
			])
		])
	]);
}
