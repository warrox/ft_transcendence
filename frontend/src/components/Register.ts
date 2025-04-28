import { Div, P, Button, Input, Span, Li, UList } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { navigateTo, rerender } from "../router/router";
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
	inputCss,
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

let registerState: "idle" | "success" | "error" = "idle";

export function Register(): PongNode<any> {

	const nameInput = Input({ 
		id: "name", 
		required: true, 
		onChange: () => {},
		placeholder: "name",
		class: inputCss,
	});
	const lastNameInput = Input({
		id: "lastname", 
		required: true, 
		onChange: () => {},
		placeholder: "last name",
		class: inputCss,
	});
	const mailInput = Input({
		id: "mail", 
		required: true, 
		onChange: () => {},
		placeholder: "email",
		class: inputCss,
	});
	const passwordInput = Input({
		id: "password", 
		type: "password", 
		required: true, 
		onChange: () => {},
		placeholder: "password",
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
			console.log(res)
			return res.text();
		})
		.then(body => {
			console.log("res brute :", body);
			try {
				const parsedBody = JSON.parse(body);
				console.log("Body parsed:", parsedBody);
				registerState = "success";
				rerender();
				setTimeout(() => {
					navigateTo('/home');
				}, 2000);
			} catch (e) {
				console.error("Erreur de parsing JSON :", e);
				registerState = "error";
				rerender();
			}
		})
		.catch(e => console.error("Erreur :", e));
	}

	(window as any).onSignIn = (response: any) => {
		const idToken = response.credential;

		fetch("http://localhost:3000/gsignin", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ token: idToken }),
		})
		.then(res => {
			if (!res.ok)
				throw new Error(`HTTP error! Status: ${res.status}`);
			return res.text();
		})
		.then(body => {
			console.log("Google Sign-in response:", body);
		})
		.catch(e => console.error("Erreur Google Sign-in :", e));
	};

	setTimeout(() => {
		if (window.google && window.google.accounts?.id) {
			window.google.accounts.id.initialize({
				client_id: "38147679342-b3t2eq1316n4uucavd5nah6agapoaa27.apps.googleusercontent.com",
				callback: window.onSignIn,
			});
			window.google.accounts.id.renderButton(
				document.getElementById("google-button-container"),
				{ theme: "outline", size: "large" }
			);
		}
	}, 0);

	console.log()

	// const registerWrapperCss = "flex items-center justify-center min-h-screen"
	// const registerCardCss = "bg-bgGray border-borderGray border rounded-xl backdrop-blur-md space-y-6 p-8 rounded-2xl w-full max-w-md";
	// "rounded-xl border-white/30 bg-white/10 border backdrop-blur-md space-y-6 bg-white p-8 rounded-2xl shadow-xl w-full max-w-md";

	return Div({ class: areaCss }, [
		UList({ class: circlesCss }, [
			Li({ class: circle1Css }),
			Li({ class: circle2Css }),
			Li({ class: circle3Css }),
			Li({ class: circle4Css }),
			Li({ class: circle5Css }),
			Li({ class: circle6Css }),
			Li({ class: circle7Css }),
			Li({ class: circle8Css }),
			Li({ class: circle9Css }),
			Li({ class: circle10Css }),
		]),
		Div({ class: `${WrapperCss} ${backgroundCss}` }, [
			Div({ class: loginCardCss }, [
				Div({ class: headerCss }, [
					P({ class: neonTextCss }, ["Register Page"]),
				]),
				Div({ class: inputWrapperCss }, [
					nameInput,
					lastNameInput,
					mailInput,
					passwordInput,
				]),
				Div({ id: "google-button-container", class: "w-fit mx-auto" }),
				Button({
					id: "button1",
					onClick: handleRegister,
					class: fancyButtonCss,
				}, [
					Div({ class: fancyLeftBorderCss }),
					P({ class: disappearingTextCss }, ["Click here"]),
					Span({ class: appearingTextCss }, ["Sign In"]),
					Div({ class: fancyRightBorderCss }),
				]),
				registerState === "success" 
				? Div({ class: "mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg" }, [
					P({ class: "text-green-500 text-center" }, [
						"Inscription réussie! Redirection en cours..."
					])
				  ])
				: registerState === "error"
				? Div({ class: "mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg" }, [
					P({ class: "text-red-500 text-center" }, [
						"Erreur lors de l'inscription. Veuillez réessayer."
					])
				  ]) :
				  Div({}),
			])
		])
	]);
}
