import { Div, P, Button, Input, Image } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";
import { AuthStore } from "../stores/AuthStore";
import {
	inputScaleCss,
	inputMailProfilCss
} from "../styles/cssFactory";
import "../styles/index.css";
let Status: null | "OK" | "KO" = null;


// let avatarPath: string = "../assets/avatar.png";
// let avatarPath = 'http://127.0.0.1/uploads/avatar-user-test@test.com-1746538352822-testpng.jpeg';
// let avatarPath = '../assets/testpng.jpeg'

// let avatarPath = AuthStore.user?.avatar_path
// 	? "http://localhost:3000" + AuthStore.user.avatar_path
// 	: "../assets/avatar.png";

function getAvatarPath() {
	return AuthStore.user?.avatar_path
		? AuthStore.user.avatar_path
		: "../assets/avatar.png";
}

let is2FAEnabled = false;

function toggle2FA() {
	is2FAEnabled = !is2FAEnabled;
	rerender();
}



export function Profil() : PongNode<any> {
	const email = AuthStore.user?.email;

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
				AuthStore.user!.avatar_path = avatarPathFromBackend;
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
	
	
	const handleEditMail = () => {

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
			if (res.ok) {
				const text = await res.text();
		
				try {
					const json = JSON.parse(text);
					console.log(json);
					AuthStore.user!.email = body.newMail;
					Status = "OK";
				} catch (_) {
					AuthStore.user!.email = body.newMail;
					Status = "OK";
				}
			} else {
				console.log("here");
				
				Status = "KO";
			}
		})
		.catch(e => {
			console.error("Fetch failed:", e);
			Status = "KO";
		})
		.finally(() => {
			rerender();
		});
		
	};

	const handleEditPass = () => {
 
		const newpassword = (document.querySelector("#passwordInputProfil") as HTMLInputElement)?.value;

		const body = { 
			email,
			newpassword, 
		};

		console.log(email, newpassword);

		fetch("/api/updatePassword", {
			method: "POST",
			body: JSON.stringify(body),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(async res => {
			if (res.ok) {
				// const text = await res.text();
		
				try {
					// const json = JSON.parse(text);
					// AuthStore.user!.email = body.newpassword;
					Status = "OK";
				} catch (_) {
					// AuthStore.user!.email = body.newpassword;
					Status = "OK";
				}
			} else {
				Status = "KO";
			}
		})
		.catch(e => {
			console.error("Fetch failed:", e);
			Status = "KO";
		})
		.finally(() => {
			rerender();
		});
	};

	const handle2FA = () => {
		is2FAEnabled = !is2FAEnabled;
		const is_2Fa = is2FAEnabled ? 1 : 0; 

		const body = {
			is_2Fa,
		}

		fetch("/api/post2Fa", {
			method: "POST",
			body: JSON.stringify(body),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(async res => {
			console.log(res);
			if (res.ok)
				console.log("Yes");
				
		})
		.catch(e => {
			console.error("Fetch failed:", e);
			Status = "KO";
		})
		.finally(() => {
			rerender();
		});
	}


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
					Image({
						id : "editorImg",
						class: "w-5 transition-transform duration-200 hover:scale-110 cursor-auto",
						src: "../assets/save.webp"
					})
				])
			]),
			Div({ class: "flex items-center justify-between" }, [
				Image({ id: "pass_img", src: "../assets/lock.svg", alt: "pass_img", class: "imageCenter w-8" }),
				passwordInput,
				Button({ id: "editorButton2", onClick: handleEditPass}, [
					Image({
						id : "editorImg2",
						class: "w-5 transition-transform duration-200 hover:scale-110",
						src: "../assets/save.webp"
					})
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
							${is2FAEnabled ? "bg-green-500" : "bg-gray-300"}
						`
					}),
					Div({
						class: `
							absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md 
							transition-transform duration-300
							${is2FAEnabled ? "translate-x-6" : "translate-x-0"}
						`
					})
				]),
				Div({}),
			])
		]),
		
	]);
}