import { Div, P, Button, Input, Image } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { navigateTo, rerender } from "../router/router";
import { AuthStore } from "../stores/AuthStore";
import {
	inputScaleCss,
	inputMailProfilCss
} from "../styles/cssFactory";
import "../styles/index.css";

let mailStatus: null | "OK" | "KO" = null;
let passStatus: null | "OK" | "KO" = null;



function getAvatarPath() {
	return AuthStore.instance.user?.avatar_path
		? AuthStore.instance.user.avatar_path
		: "../assets/avatar.png";
}


export function Profil() : PongNode<any> {

	const email = AuthStore.instance.user?.email;

	const fileInput = Input({
		id: "fileInput",
		type: "file",
		class: "hidden",
		onChange: () => {
			const input = document.getElementById("fileInput") as HTMLInputElement;
			const file = input?.files?.[0];
			if (file) {
				handleEditAvatar(file);
			}
		}
	});
	const emailInput = Input({ 
		id: "emailInputProfil",
		value: email,
		required: true, 
		onChange: () => {},
		class: inputMailProfilCss,
		pattern: "[^\\s@]+@[^\\s@]+\\.[^\\s@]+",
	});
	const passwordInput = Input({
		id: "passwordInputProfil",
		type: "password",
		required: true,
		onChange: () => {},
		class: inputScaleCss,
		placeholder: "***************"
	});


	function handleEditAvatar(file: File) {
		console.log("ok");
		const formData = new FormData();
		formData.append("avatar", file);
		formData.append("email", email!);
	
		fetch("/api/updateAvatar", {
			method: "POST",
			body: formData,
			credentials: "include",
		})
		.then(async (res) => {
			if (res.ok) {
				const { avatarPath: avatarPathFromBackend } = await res.json();
				AuthStore.instance.user!.avatar_path = avatarPathFromBackend;
				console.log("Upload success")
			} else {
				console.error("Upload failed");
			}
		})
		.catch((e) => {
			console.error("Fetch failed:", e);
		})
		.finally(() => {
			rerender();
		});
	
	}

	// const handleEditMail = async () => {
	// 	const newMail = (document.querySelector("#emailInputProfil") as HTMLInputElement)?.value; 
		
	// 	const body = { 
	// 		email,
	// 		newMail, 
	// 	};
	
	// 	try {
	// 		// Réinitialiser le statut avant la requête
	// 		mailStatus = null;
	// 		rerender();
	
	// 		const updateMail = await fetch("/api/updateMail", {
	// 			method: "POST",
	// 			body: JSON.stringify(body),
	// 			credentials: "include",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 		});
	
	// 		const responseData = await updateMail.json();
	// 		console.log("Backend response:", responseData);
	
	// 		if (!updateMail.ok) {
	// 			mailStatus = "KO";
	// 			console.error("Update failed:", responseData.error || "Unknown error");
	// 			rerender();
	// 			setTimeout(() => {
	// 				mailStatus = null;
	// 				rerender();
	// 			}, 3000);
				
	// 			return;
	// 		}
			
	// 		mailStatus = "OK";
	// 		await AuthStore.instance.refresh();
			
	// 		// Forcer un rendu immédiat pour afficher l'état OK
	// 		// rerender();
			
	// 		// Réinitialiser après 3 secondes
	// 		setTimeout(() => {
	// 			mailStatus = null;
	// 			rerender();
	// 		}, 3000);
			
	// 	} catch (e) {
	// 		console.error("Email update failed:", e);
	// 		mailStatus = "KO";
			
	// 		// Forcer un rendu immédiat
	// 		rerender();
			
	// 		setTimeout(() => {
	// 			mailStatus = null;
	// 			rerender();
	// 		}, 3000);
	// 	}
	// };
	
	
	const handleEditMail = async () => {

		const newMail = (document.querySelector("#emailInputProfil") as HTMLInputElement)?.value; 
		
		const body = { 
			email,
			newMail, 
		};

		console.log(email, newMail);

		try  {
			const updateMail = await fetch("/api/updateMail", {
				method: "POST",
				body: JSON.stringify(body),
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			})

			const responseData = await updateMail.json();
			console.log(responseData);
			
			if (!responseData.success) {
				mailStatus = "KO";
				console.error("Update failed:", responseData.error || "Unknown error");
				rerender();
				setTimeout(() => {
					mailStatus = null;
					rerender();
				}, 3000);
				throw new Error("Failed to update Mail");
				return;
			}
			
			mailStatus = "OK";
			await AuthStore.instance.refresh();
			setTimeout(() => {
				mailStatus = null;
				rerender();
			}, 3000);
		} catch (e) {
			console.error("Email update failed: ", e);
			mailStatus = "KO";
			rerender();
			setTimeout(() => {
				mailStatus = null;
				rerender();
			}, 3000);
		}

	// 	// fetch("/api/updateMail", {
	// 	// 	method: "POST",
	// 	// 	body: JSON.stringify(body),
	// 	// 	credentials: "include",
	// 	// 	headers: {
	// 	// 		"Content-Type": "application/json",
	// 	// 	},
	// 	// })
	// 	// .then(async res => {
	// 	// 	if (res.ok) {
	// 	// 		const text = await res.text();
		
	// 	// 		try {
	// 	// 			const json = JSON.parse(text);
	// 	// 			console.log(json);
	// 	// 			AuthStore.instance.user!.email = body.newMail;
	// 	// 		} catch (_) {
	// 	// 			AuthStore.instance.user!.email = body.newMail;
	// 	// 			Status = "OK";
	// 	// 		}
	// 	// 	} else {
	// 	// 		console.log("here");
				
	// 	// 		Status = "KO";
	// 	// 	}
	// 	// })
	// 	// .catch(e => {
	// 	// 	console.error("Fetch failed:", e);
	// 	// 	Status = "KO";
	// 	// })
	// 	// .finally(() => {
	// 	// 	rerender();
	// 	// });

	};

	const handleEditPass = async () => {
 
		const newpassword = (document.querySelector("#passwordInputProfil") as HTMLInputElement)?.value;

		const body = { 
			email,
			newpassword, 
		};

		console.log(email, newpassword);

		try  {
			const updatePass = await fetch("/api/updatePassword", {
				method: "POST",
				body: JSON.stringify(body),
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (!updatePass.ok) {
				passStatus = "KO"; 
				rerender();
				setTimeout(() => {
					passStatus = null;
					rerender();
				}, 3000);
				throw new Error("Failed to update Pass");
			}
			
			passStatus = "OK";
			await AuthStore.instance.refresh();
			rerender();
			setTimeout(() => {
				passStatus = null;
				rerender();
			}, 3000);
		} catch (e) {
			console.error("Pass update failed: ", e);
			passStatus = "KO";
			rerender();
			setTimeout(() => {
				passStatus = null;
				rerender();
			}, 3000);
			
		}

		// fetch("/api/updatePassword", {
		// 	method: "POST",
		// 	body: JSON.stringify(body),
		// 	credentials: "include",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// })
		// .catch(e => {
		// 	console.error("Fetch failed:", e);
		// 	Status = "KO";
		// })
		// .finally(() => {
		// 	rerender();
		// });
	};


	const handle2FA = async () => {
		const currentState = AuthStore.instance.user!.is_2FA;
		const newState = currentState ? 0 : 1;

		console.log("newState : ", newState);

		try {
			const updateRes = await fetch("/api/post2Fa", {
				method: "POST",
				body: JSON.stringify({ is_2Fa: newState }),
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!updateRes.ok) {
				throw new Error("Failed to update 2FA");
			}

			await AuthStore.instance.refresh();
			console.log("is_2FA after refresh:", AuthStore.instance.user?.is_2FA);

		} catch (e) {
			console.error("2FA update failed:", e);
		}
		rerender();
	};

	console.log("mailStatus: ", mailStatus);
	

	return Div({
		class: "min-h-screen bg-yellow-400 flex flex-col items-center pt-20"
	}, [
		Div({
			class: "relative w-48 h-48 rounded-full overflow-hidden group cursor-pointer"
		}, [
			Image({
				id: "avatarImg",
				class: `
					w-full h-full object-cover transition duration-300
					group-hover:brightness-75
				`,
				src: getAvatarPath(),
			}),
			Div({
				class: `
					absolute top-0 left-0 w-full h-full flex items-center justify-center
					opacity-0 group-hover:opacity-100 transition duration-300
					pointer-events-none
				`
			}, [
				Image({
					id: "testimg",
					src: "../assets/pen.svg",
					alt: "Edit",
					class: "w-10 h-10"
				})
			]),
			Button({
				id: "testbuton",
				class: "absolute inset-0",
				onClick: () => {
					const input = document.getElementById("fileInput") as HTMLInputElement;
					input?.click();
				}
			})
		]),
		fileInput,
		Div({ 
			class: "mt-20 w-[400px] p-4 bg-yellow-500 rounded-xl shadow-lg space-y-4" 
		}, [
			Div({ class: "flex items-center justify-between" }, [
				Image({ id: "login_img", src: "../assets/login.png", alt: "login_img", class: "imageCenter w-8" }),
				emailInput,
				Button({ id: "editorButton1",  onClick: handleEditMail}, [
					mailStatus == "KO" ?
					Image({
						id : "editorImg",
						class: "w-5 transition-transform duration-200 hover:scale-110 cursor-auto bg-red-500",
						src: "../assets/save.webp"
					}) 
					:
					mailStatus == "OK" ?
					Image({
						id : "editorImg",
						class: "w-5 transition-transform duration-200 hover:scale-110 cursor-auto bg-green-500",
						src: "../assets/save.webp"
					}) :
					Image({
						id : "editorImg",
						class: "w-5 transition-transform duration-200 hover:scale-110 cursor-auto",
						src: "../assets/save.webp"
					}),
				])
			]),
			Div({ class: "flex items-center justify-between" }, [
				Image({ id: "pass_img", src: "../assets/lock.svg", alt: "pass_img", class: "imageCenter w-8" }),
				passwordInput,
				Button({ id: "editorButton2", onClick: handleEditPass}, [
					passStatus == "KO" ?
					Image({
						id : "editorImg",
						class: "w-5 transition-transform duration-200 hover:scale-110 cursor-auto bg-red-500",
						src: "../assets/save.webp"
					}) : 
					passStatus == "OK" ?
					Image({
						id : "editorImg",
						class: "w-5 transition-transform duration-200 hover:scale-110 cursor-auto bg-green-500",
						src: "../assets/save.webp"
					}) :
					Image({
						id : "editorImg",
						class: "w-5 transition-transform duration-200 hover:scale-110 cursor-auto",
						src: "../assets/save.webp"
					}),
				])
			]),
			Div({ class: "flex items-center justify-between" }, [
				Image({ id:"2fa_img", src: "../assets/2fa.png", alt: "2FA", class: "w-8" }),

				Button({
					id: "test",
					class: "relative w-12 h-6",
					onClick: handle2FA,
				}, [
					Div({
						class: `
							absolute inset-0 rounded-full transition-colors duration-300 
							${AuthStore.instance.user?.is_2FA ? "bg-green-500" : "bg-gray-300"}
						`
					}),
					Div({
						class: `
							absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md 
							transition-transform duration-300
							${AuthStore.instance.user?.is_2FA ? "translate-x-6" : "translate-x-0"}
						`
					})
				]),
				Div({}),
			])
		]),
		
	]);
}