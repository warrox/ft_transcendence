import { Div, P, Button, Input, Image, H1, H2, UList, Li } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";
import { inputCss } from "../styles/cssFactory";
import { fancyButtonCss, fancySpanCss } from "../styles/cssFactory";

import logo from '../assets/logo.png';

let loginStatus: null | "OK" | "KO" = null

export function Login(): PongNode<any> {
	const emailInput = Input({ 
		id: "emailInput", 
		required: true, 
		onChange: () => {},
		class: inputCss,
	});
	const passwordInput = Input({
		id: "password",
		type: "password",
		required: true,
		onChange: () => {},
		class: inputCss,
	});

	// TESTING IMG
	const testImg = Image({ id: "test_button", src: logo, alt: "my_logo"});

	const handleLogin = () => {
		const email = (document.querySelector("#emailInput") as HTMLInputElement)?.value;
		const password = (document.querySelector("#password") as HTMLInputElement)?.value;
	
		const body = {
			email: email,
			password: password,
		};
	
		fetch("http://localhost:3000/login", {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(async res => {
			if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
			const text = await res.text();
			console.log("Réponse brute du serveur :", text);

			try {
				const parseBody = JSON.parse(text);
				console.log("Response parsed from JSON :", parseBody);
				if (parseBody.success === true)
					loginStatus = "OK";
				else
					loginStatus = "KO";
			}
			catch (e) {
				console.log("Error parsing JSON: ", e);
				loginStatus = "KO";
			}
		})
		.catch(e => {
			console.log("Error while requesting:" , e);
			loginStatus = "KO";
		})
		.finally(() => {
			rerender();
		});
	}

	return Div({}, [
		// TESTING H1 | H2
		H1({ class: "text-3xl font-bold text-center"}, ["Login Page"]),
		H2({ class: "text-2xl text-center"}, ["Login Page H2"]),
		P({}, ["Login page!"]),
		UList({}, [
			Li({}, ["Item 1"]),
			Li({}, ["Item 2"]),
			Li({}, ["Item 3"]),
		]),
		testImg,
		emailInput,
		passwordInput,
		Button({
			class: fancyButtonCss,
			id: "button1",
			onClick: handleLogin
		}, [
			"Log In",
			...fancySpanCss.map(css => Div({ class: css }))
		]),
		// Button({ class: "bg-sky-500 hover:bg-sky-700 ..." ,id: "button1", onClick: handleLogin } , ["Log In"]),
		P({}, [`Login status: ${loginStatus ?? 'N/A'}`])
	])
}