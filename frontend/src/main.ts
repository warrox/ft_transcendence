import { rerender, router } from './router/router';
import './types/window.d.ts';
import './i18n';
import { AuthStore } from './stores/AuthStore.ts';

window.addEventListener("DOMContentLoaded", async () => {
	AuthStore.instance.subscribe(rerender);

	const token = localStorage.getItem("access_token");
	if (token)
		await AuthStore.instance.fetchMe();
	router();
});

window.addEventListener("popstate", router);
