import { Div, P, Button, Input } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";
import { inputCss } from "../styles/cssFactory";

export function Register(): PongNode<any> {
	const nameInput = Input({ 
		id: "name", 
		required: true, 
		onChange: () => {},
		class: inputCss,
	});
	const lastNameInput = Input({
		id: "lastname", 
		required: true, 
		onChange: () => {},
		class: inputCss,
	});
	const mailInput = Input({
		id: "mail", 
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

	
	const handleRegister = () => {
		const name = (document.querySelector("#name") as HTMLInputElement)?.value;
		const lastName = (document.querySelector("#lastname") as HTMLInputElement)?.value;
		const mail = (document.querySelector("#mail") as HTMLInputElement)?.value;
		const password = (document.querySelector("#password") as HTMLInputElement)?.value;
		const body = {
			name: name,
			surname: lastName,
			email: mail,
			password: password,
		}

		fetch("/api/register", {
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
		P({}, ["Register to our service"]),
		nameInput,
		lastNameInput,
		mailInput,
		passwordInput,
		Button({ class: "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" ,id: "button1", onClick: handleRegister }, ["Register"]),
	])
}
