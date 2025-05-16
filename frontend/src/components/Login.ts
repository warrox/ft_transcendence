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
	circle10Css,
	inputCss
} from "../styles/cssFactory";

import "../styles/index.css";
import { t } from "i18next";
import i18n from "i18next";

let loginStatus: null | "OK" | "KO" = null;

let registerState: "idle" | "success" | "error" = "idle";

function resetRegisterState(delay = 3000) {
	setTimeout(() => {
		registerState = "idle";
		// rerender();
	}, delay);
}

let requires2FA = false;
let twoFactorCode = "";


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

	const handleLogin = () => {
		const email = (document.querySelector("#emailInput") as HTMLInputElement)?.value;
		const password = (document.querySelector("#password") as HTMLInputElement)?.value;

		console.log("is2fa", AuthStore.instance.user?.is_2FA)

		const body = {
			email,
			password,
		};

		fetch("/api/login", {
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
				console.log("user = ", AuthStore.instance.user);
				console.log("is2fa = ", AuthStore.instance.user?.is_2FA);

				if (parseBody.success === true && AuthStore.instance.user?.is_2FA === 1) {
					requires2FA = true;
					rerender();
					return;
				}

				loginStatus = parseBody.success === true ? "OK" : "KO";
				AuthStore.instance.isLoggedIn = true;
				setTimeout(() => {
					navigateTo('/home');
				}, 1500);
			} catch (e) {
				console.log("Error parsing JSON: ", e);
				loginStatus = "KO";
				rerender();
			}
		})

		.finally(() => {
			rerender();
		});
	};

	const handle2FAValidation = () => {
		fetch("/api/2fa", {
			method: "POST",
			body: JSON.stringify({ code: twoFactorCode }),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(async res => {
			if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
			const json = await res.json();
			if (json.success) {
				loginStatus = "OK";
				AuthStore.instance.isLoggedIn = true;
				setTimeout(() => {
					navigateTo("/home");
				}, 1500);
			} else {
				loginStatus = "KO";
			}
		})
		.catch(err => {
			console.error("2FA error:", err);
			loginStatus = "KO";
		})
		.finally(() => {
			rerender();
		});
	};


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
				Input({
					id: "test",
					type: "text",
					placeholder: "4-digit code",
					maxlength: 4,
					value: twoFactorCode,
					class: "border border-gray-300 rounded px-3 py-2 w-full text-center text-lg mb-4",
					onChange: () => {
						const input = document.querySelector("#twoFactorInput") as HTMLInputElement;
						if (!input) return;
						twoFactorCode = input.value;
						if (twoFactorCode.length === 4) {
							handle2FAValidation();
						}
					}
				}),
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
						P({ class: loginStatus === "OK" ? statusOkCss : statusKoCss }, [`Login status: ${loginStatus}`])
					])]
					: [])
			])
		]),
	]);
}
