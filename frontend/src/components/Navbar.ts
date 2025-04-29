import { PongNode } from "../lib/PongNode";
import { Button, Div, Link } from "../lib/PongFactory";
import { linkCss } from "../styles/cssFactory";
import { AuthStore } from "../stores/AuthStore";
import { navigateTo } from "../router/router";
import { rerender } from "../router/router";

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
		console.log("test");
		fetch("/api/logout", {
			method: "GET",
			credentials: "include",
			headers: {
				'Content-Type': 'application/json',
			}
		})
		.then(res => {
			if (!res.ok)
				throw new Error(`HTTP error! Status: ${res.status}`);
			console.log(res)
			return res.text();
		})
		.then(body => {
			console.log("res brute :", body);
			try {
				const parsedBody = JSON.parse(body);
				console.log("Body parsed:", parsedBody);
				//// !!!!!!!!!!!!!!!!!!!!!
				setTimeout(() => {
					navigateTo('/home')
				}, 2000);
				rerender();
			} catch (e) {
				console.error("Erreur de parsing JSON :", e);
				rerender();
			}
		})
		.catch(e => console.error("Erreur :", e));
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
				Button({
					id: "logoutButton",
					onClick: handleDisconnect,
					class: "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded",
				}, ["Disconnect"])
			])
		])
	]);
}
