import { rerender, router } from './router/router';
import './types/window.d.ts';
import './i18n';
import { AuthStore } from './stores/AuthStore.ts';
import {initWebSocketClient, disconnectWebSocketClient } from './lib/socketClient.ts';

export function getCookie(name: string): string {
	const cookies = document.cookie.split("; ");
	for (const cookie of cookies) {
		const [key, value] = cookie.split("=");
		if (key === name) return decodeURIComponent(value);
	}
	return "null";
}

// Utilisation :
export function updateWs(): void {
	const token = getCookie("access_token");
	console.log("Token:", token);
	window.addEventListener("DOMContentLoaded", async () => {
		AuthStore.instance.subscribe(rerender);
			await AuthStore.instance.fetchMe(); 
			if (AuthStore.instance.isLoggedIn) {
				console.log("JE SUIS LOG");
				initWebSocketClient("ws://localhost:3000/ws", getCookie("access_token"));
			}
		router();
	});
}

window.addEventListener("popstate", router);
updateWs();