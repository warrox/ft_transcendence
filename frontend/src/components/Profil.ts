import { Div, P, Button, Input, Span, Li, UList } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";
import { navigateTo } from "../router/router";
import { AuthStore } from "../stores/AuthStore";
import {
	backgroundCss,
	fancyButtonCss,
	fancyLeftBorderCss,
	fancyRightBorderCss,
	disappearingTextCss,
	appearingTextCss,
	WrapperCss,
	loginCardCss,
	headerCss,
	neonTextCss,
	inputWrapperCss,
	statusWrapperCss,
	statusKoCss,
	statusOkCss,
	inputScaleCss,
	areaCss,
	circlesCss,
	circle1Css,
	circle2Css,
	circle3Css,
	circle4Css,
	circle5Css,
	circle6Css,
	circle7Css,
	circle8Css,
	circle9Css,
	circle10Css
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

export function Profil(): PongNode<any> {
	
	const emailInput = Input({ 
		id: "emailInputProfil", 
		required: true, 
		onChange: () => {},
		class: inputScaleCss,
		placeholder: 'changeEmail'
	});
	const passwordInput = Input({
		id: "passwordInputProfil",
		type: "password",
		required: true,
		onChange: () => {},
		class: inputScaleCss,
		placeholder: 'changePass',
	});
	
	
	const handleEditPass = () => {
		const email = AuthStore.user?.email;
		const newpassword = (document.querySelector("#passwordInputProfil") as HTMLInputElement)?.value;

		// console.log("oldmail = ", oldMail);
		// console.log("newpass", password);
		
		const body = { 
			email,
			newpassword 
		};

		fetch("/api/updatePassword", {
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
				// setTimeout(() => {
				// 	navigateTo('/home');
				// }, 1500);
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

	return Div({}, [
		Div({ class: `${WrapperCss} ${backgroundCss}` }, [
			Div({ class: loginCardCss }, [
				Div({ class: headerCss }, [
					P({ class: neonTextCss }, ["Edit Page"]),
				]),
				Div({ class: inputWrapperCss }, [
					emailInput,
					passwordInput,
				]),
				Button({
					id: "button1",
					onClick: handleEditPass,
					class: fancyButtonCss,
				}, [
					Div({ class: fancyLeftBorderCss }),
					P({ class: disappearingTextCss }, ["Click here"]),
					Span({ class: appearingTextCss }, ["Edit"]),
					Div({ class: fancyRightBorderCss }),
				]),
				...(loginStatus !== null
					? [Div({ class: statusWrapperCss }, [
						P({ class: loginStatus === "OK" ? statusOkCss : statusKoCss }, [`Login status: ${loginStatus}`])
					])]
					: [])
			])
		]),
	]);
}
