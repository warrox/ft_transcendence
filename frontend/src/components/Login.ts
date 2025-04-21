import { Div, P, Button, Input, Span } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";
import { backgroundCss, fancyButtonCss, fancyLeftBorderCss, fancyRightBorderCss, disappearingTextCss, appearingTextCss, loginWrapperCss, loginCardCss, headerCss, headerTextCss, inputWrapperCss, statusWrapperCss, statusKoCss, statusOkCss, inputScaleCss } from "../styles/cssFactory";

let loginStatus: null | "OK" | "KO" = null

export function Login(): PongNode<any> {
	const emailInput = Input({ 
		id: "emailInput", 
		required: true, 
		onChange: () => {},
		class: inputScaleCss,
	});
	const passwordInput = Input({
		id: "password",
		type: "password",
		required: true,
		onChange: () => {},
		class: inputScaleCss,
	});

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

	return Div({ class: `${loginWrapperCss} ${backgroundCss}` }, [
		Div({ class: loginCardCss }, [
			Div({ class: headerCss }, [
				P({ class: headerTextCss }, ["Login Page"]),
			]),
			Div({ class: inputWrapperCss }, [
				emailInput,
				passwordInput,
			]),
			Button({
				id: "button1",
				onClick: handleLogin,
				class: fancyButtonCss
			}, [
				Div({ class: fancyLeftBorderCss }),
				P({ class: disappearingTextCss }, ["Click here"]),
				Span({ class: appearingTextCss }, ["Login"]),
				Div({ class: fancyRightBorderCss })
			]),
			...(loginStatus !== null
				? [Div({ class: statusWrapperCss }, [
					P({ class: loginStatus === "OK" ? statusOkCss : statusKoCss }, [`Login status: ${loginStatus}`])
				])]
				: [])
		])
	]);
	
}
