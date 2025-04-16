import { Div, P, Button, Input } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";

import "tailwindcss"

export function Login(): PongNode<any> {
	const nameInput = Input({ id: "name", required: true, onChange: () => {}});
	const passwordInput = Input({ id: "password", type: "password", required: true, onChange: () => {}});

	const handleLogin = () => {
		const name = (document.querySelector("#name") as HTMLInputElement)?.value;
		const password = (document.querySelector("#password") as HTMLInputElement)?.value;
		const body = {
			name: name,
			password: password,
		}

		fetch("http://localhost:3000/login", {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			}
		})
		.then(res => {
			if (!res.ok)
				throw new Error(`HTTP error! Status: ${res.status}`);
			return res.text();
		})
		.then(body => {
			console.log("res brute :", body);
			try {
				const parsedBody = JSON.parse(body);
				console.log("Body parsed:", parsedBody);
			} catch (e) {
				console.error("Erreur de parsing JSON :", e);
			}
		})
		.catch(e => console.error("Erreur :", e));
		// rerender()
	}

	return Div({}, [
		P({}, ["Login page!"]),
		nameInput,
		passwordInput,
		Button({ class: "bg-sky-500 hover:bg-sky-700 ..." ,id: "button1", onClick: handleLogin } , ["Log In"])
	])
}