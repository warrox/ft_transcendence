import { Div, P, Button, Input, Image } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";
import { AuthStore } from "../stores/AuthStore";
import {
	inputScaleCss,
} from "../styles/cssFactory";

import "../styles/index.css";

let loginStatus: null | "OK" | "KO" = null;

let registerState: "idle" | "success" | "error" = "idle";

function resetRegisterState(delay = 3000) {
	setTimeout(() => {
		registerState = "idle";
		// rerender();
	}, delay);
}


export function Profil() : PongNode<any> {
	const email = AuthStore.user?.email;
	const emailInput = Input({ 
		id: "emailInputProfil",
		value: email,
		required: true, 
		onChange: () => {},
		class: inputScaleCss,
	});
	// const passwordInput = Input({
	// 	id: "passwordInputProfil",
	// 	type: "password",
	// 	required: true,
	// 	onChange: () => {},
	// 	class: inputScaleCss,
	// 	placeholder: 'changePass',
	// });
	
	// const newpassword = (document.querySelector("#passwordInputProfil") as HTMLInputElement)?.value;

	const handleEditPass = () => {

		const newMail = (document.querySelector("#emailInputProfil") as HTMLInputElement)?.value; 
		
		const body = { 
			email,
			newMail, 
		};

		console.log(email, newMail);

		fetch("/api/updateMail", {
			method: "POST",
			body: JSON.stringify(body),
			credentials: "include",
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
				loginStatus = parseBody.success === true ? "OK" : "KO";
				rerender();
			} catch (e) {
				console.log("Error parsing JSON: ", e);
				loginStatus = "KO";
				rerender();
			}
		})
		.catch(e => {
			console.log("Error while requesting:" , e);
			loginStatus = "KO";
		})
		.finally(() => {
			rerender();
		});
	};



	return Div({ 
		class: "min-h-screen bg-yellow-400 flex flex-col items-center pt-20"
	}, [
		Div({
			class: "w-50 h-50 rounded-full overflow-hidden bg-gray-200"
		}, [
			Image({
				id: "avatarImg",
				class: "w-full h-full object-cover",
				src: "../assets/avatar.png",
			})
		]),
		Div({ 
			class: "mt-20 w-[400px] p-4 bg-yellow-500 rounded-xl shadow-lg space-y-4" 
		}, [
			Div({ class: "flex items-center justify-between" }, [
				Image({ id: "login_img", src: "../assets/login.png", alt: "login_img", class: "imageCenter w-8" }),
				emailInput,
				Button({ id: "editorButton1", onClick: handleEditPass}, [
					Image({
						id : "editorImg",
						class: "w-5 transition-transform duration-200 hover:scale-110",
						src: "../assets/save.webp"
					})
				])
			]),
		])
	])
}