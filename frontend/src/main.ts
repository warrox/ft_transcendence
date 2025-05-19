import { rerender, router } from './router/router';
import './types/window.d.ts';
import './i18n';
import { AuthStore } from './stores/AuthStore.ts';
import { navigateTo } from './router/router';

window.addEventListener("DOMContentLoaded", async () => {
	AuthStore.instance.subscribe(rerender);

	const token = localStorage.getItem("access_token");
	if (token)
		await AuthStore.instance.fetchMe();
	router();

	let wasLoggedIn = AuthStore.instance.isLoggedIn;

	setInterval(async () => {
		await AuthStore.instance.fetchMe();
		const isLoggedInNow = AuthStore.instance.isLoggedIn;

		console.log("[Interval] wasLoggedIn:", wasLoggedIn);
		console.log("[Interval] isLoggedInNow:", isLoggedInNow);

		// Si on vient de perdre la session (cookie supprimé ou expiré)
		if (wasLoggedIn && !isLoggedInNow) {
			console.warn("Session expirée...");
			if (window.location.pathname !== '/landing')
				navigateTo('/landing');
		}

		wasLoggedIn = isLoggedInNow;
	}, 10000);
});

window.addEventListener("popstate", router);
