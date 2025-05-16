import { rerender, router } from './router/router';
import './types/window.d.ts';
import './i18n';
import { AuthStore } from './stores/AuthStore.ts';

window.addEventListener("DOMContentLoaded", async () => {
	AuthStore.instance.subscribe(rerender);
	await AuthStore.instance.fetchMe();
	router();
});

window.addEventListener("popstate", router);
