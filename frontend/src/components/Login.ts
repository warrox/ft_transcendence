import { Div, P, Button, Input, Span } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";
import { inputCss } from "../styles/cssFactory";

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

	return Div({
		class: "flex items-center justify-center min-h-screen bg-gray-100"
	}, [
		Div({
			class: "space-y-6 bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
		}, [
			// Header
			Div({ class: "text-center" }, [
				P({ class: "text-2xl font-bold text-gray-800" }, ["Login Page"]),
			]),
	
			// Inputs
			Div({ class: "flex flex-col space-y-4 self-start ml-16" }, [
				emailInput,
				passwordInput,
			]),
	
			// Button

			Div({ class: "flex justify-center" }, [
				Button({
					id: "button1",
					onClick: handleLogin,
					class: `
						group
						p-5
						cursor-pointer 
						relative  
						text-xl 
						font-normal 
						border-0 
						flex 
						items-center 
						justify-center
						bg-transparent
						text-blue-500 
						h-auto  
						w-[170px]  
						overflow-hidden   
						transition-all
						duration-100`
				}, [
					Div({ class: `
						group-hover:w-full
						absolute 
						left-0 
						h-full 
						w-5 
						border-y
						border-l
						border-blue-500
						transition-all
						duration-500`
					}),
					P({
						class: `
							group-hover:opacity-0 
							group-hover:translate-x-[-100%] 
							absolute 
							translate-x-0 
							transition-all 
							duration-200`
					}, ["Click here"]),
					Span({
						class: `
							group-hover:translate-x-0  
							group-hover:opacity-100 
							absolute  
							translate-x-full 
							opacity-0  
							transition-all 
							duration-200`
					}, ["Login"]),
					Div({
						class: `
							group-hover:w-full 
							absolute 
							right-0 
							h-full 
							w-5  
							border-y 
							border-r  
							border-blue-500 
							transition-all 
							duration-500`
					})
				])
			]),
	
			// Status
			...(loginStatus !== null
				? [Div({ class: "text-center text-sm" }, [
					P({
						class: loginStatus === "OK"
							? "text-green-500"
							: "text-red-500"
					}, [`Login status: ${loginStatus}`])
				])]
				: [])
		])
	])	
}
