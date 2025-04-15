import { Div, P, Button, Input } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";

import './Register.css'

export function Register(): PongNode<any> {
	const nameInput = Input({
		id: "name",
		required: true,
		onChange: () => {
			const nameValue = (document.querySelector("#name") as HTMLInputElement)?.value;
			console.log("typing :", nameValue);
	}});
	const lastNameInput = Input({ id: "lastname", required: true });
	const mailInput = Input({ id: "mail", required: true });
	const passwordInput = Input({ id: "password", type: "password", required: true });

	const handleRegister = () => {
		const name = (document.querySelector("#name") as HTMLInputElement)?.value;
		const lastName = (document.querySelector("#lastname") as HTMLInputElement)?.value;
		const mail = (document.querySelector("#mail") as HTMLInputElement)?.value;
		const password = (document.querySelector("#password") as HTMLInputElement)?.value;
		
		console.log("Password:", password);
		console.log("Name:", name);
		console.log("LastName:", lastName);
		console.log("Mail:", mail);

		// rerender()
		// fetch le back;
	}

	return Div({}, [
		P({}, ["Register to our service"]),
		nameInput,
		lastNameInput,
		mailInput,
		passwordInput,
		Button({ id: "button1", onClick: handleRegister }, ["Register"]),
	])
}
