import { PongNode } from "../lib/PongNode";
import { Div, Link } from "../lib/PongFactory";
import { linkCss } from "../styles/cssFactory";
import { AuthStore } from "../stores/AuthStore";
import { navigateTo } from "../router/router";

export function linkFn(linkId :string , href: string, text: string, css: string): PongNode<any> {
	return Link({
		id: linkId,
		href, 
		class: css,
		onClick: () => {
			navigateTo(href);
		}
	}, [text]);
}

export function Navbar(): PongNode<any> {
	const isLogged = AuthStore.isLoggedIn;


	const handleDisconnect = () => {
		
	}








	return Div({
		class: "top-0 left-0 w-full z-50 bg-black border-gray-200"
	}, [
		Div({
			class: "max-w-screen-xl flex flex-wrap items-center justify-around mx-auto p-4"
		}, [
			...(!isLogged ? [
				linkFn("link1", "/", "Home", linkCss),
				linkFn("link2", "/register", "Register", linkCss),
				linkFn("link3", "/login", "Login", linkCss),
			] : [
				linkFn("link4", "/home", "Home", linkCss),
				linkFn("link5", "/game", "Game", linkCss),
			])
		])
	]);
}
