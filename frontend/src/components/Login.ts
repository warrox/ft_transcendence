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
	circle10Css,
	inputCss
} from "../styles/cssFactory";

import "../styles/index.css";
import { t } from "i18next";
import { getCookie } from "../main"
import { initWebSocketClient } from '../lib/socketClient.ts';

let loginStatus: null | "OK" | "KO" = null;

let requires2FA = false;
let twoFactorCode = "";
let emailValue = "";

export function Login(): PongNode<any> {
	const emailInput = Input({
		id: "emailInput",
		required: true,
		onChange: () => { },
		class: inputCss,
	});
	const passwordInput = Input({
		id: "password",
		type: "password",
		required: true,
		onChange: () => { },
		class: inputCss,
	});

	const handleLogin = () => {
		emailValue = (document.querySelector("#emailInput") as HTMLInputElement)?.value;
		const password = (document.querySelector("#password") as HTMLInputElement)?.value;

		const body = {
			email: emailValue,
			password,
		};

		fetch("/api/login", {
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

					if (parseBody.success === true && parseBody.twoFA == true) {
						requires2FA = true;
						rerender();
						return;
					}

					loginStatus = parseBody.success === true ? "OK" : "KO";
					AuthStore.instance.isLoggedIn = true;
					setTimeout(() => {
						navigateTo('/home');
					}, 1500);
					initWebSocketClient("ws://localhost:3000/ws", getCookie("access_token"));

				} catch (e) {
					console.log("Error parsing JSON: ", e);
					loginStatus = "KO";

			}})
			.catch(error => {
				console.error("Login error: ", error);
				loginStatus = "KO";
			})
			.finally(() => {
				rerender();
			});
	};

	const twofaInput = Input({
		id: "twoFaInput",
		type: "text",
		placeholder: "4-digit code",
		maxlength: 4,
		value: twoFactorCode,
		class: "border border-gray-300 rounded px-3 py-2 w-full text-center text-lg mb-4",
	});

	const handle2FAValidation = () => {
		const email = emailValue;
		const twoFactorCode = (document.querySelector("#twoFaInput") as HTMLInputElement)?.value;

		console.log("2factorcode: ", twoFactorCode);

		fetch("/api/verify2Fa", {
			method: "POST",
			body: JSON.stringify({ code2FA: twoFactorCode, email }),
			// credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(async res => {
			if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
			const json = await res.json();
			console.log("json", json);
			
			if (json.success) {
				loginStatus = "OK";
				AuthStore.instance.isLoggedIn = true;
				AuthStore.instance.refresh()
				requires2FA = false;
				loginStatus = null;
				rerender();
				setTimeout(() => {
					navigateTo("/home");
				}, 500);
			} else {
				loginStatus = "KO";
			}})
			.finally(() => {
				rerender();
			});
	};

	(window as any).onSignIn = (response: any) => {
		const idToken = response.credential;

		fetch("http://localhost:3000/gsignin", {
			method: "POST",
			credentials: "include",
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
		requires2FA
			? Div({ class: "fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50" }, [
				Div({ class: "bg-white rounded-xl p-6 shadow-lg w-80 text-center" }, [
					P({ class: "text-xl font-semibold mb-4 text-gray-800" }, ["Enter 2FA Code"]),
					twofaInput,
					Button({
						id: "twofa_button",
						class: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full",
						onClick: handle2FAValidation,
					}, ["Done"]),
				])
			])
			: Div({}),
		Div({ class: `${WrapperCss} ${backgroundCss}` }, [
			Div({ class: loginCardCss }, [
				Div({ class: headerCss }, [
					P({ class: neonTextCss }, [t("login.login_page")]),
				]),
				Div({ class: inputWrapperCss }, [
					emailInput,
					passwordInput,
				]),
				Div({ id: "google-button-container", class: "w-fit mx-auto" }),
				Button({
					id: "button1",
					onClick: handleLogin,
					class: fancyButtonCss,
				}, [
					Div({ class: fancyLeftBorderCss }),
					P({ class: disappearingTextCss }, [t("login.click")]),
					Span({ class: appearingTextCss }, [t("login.login")]),
					Div({ class: fancyRightBorderCss }),
				]),
				...(loginStatus !== null
					? [Div({ class: statusWrapperCss }, [
						P({ class: loginStatus === "OK" ? statusOkCss : statusKoCss }, [`Login status: ${loginStatus}`]),
						...(loginStatus !== "OK"
							? [P({ class: "text-red-600 font-semibold mt-2" }, ["Incorrect email or password."])]
							: [])
					])]
					: [])
			])
		]),
	]);
}
