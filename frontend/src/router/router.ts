import { Home } from '../components/Home';
import { About } from '../components/About';
import { Navbar } from '../components/Navbar';

type Route = {
	path: string;
	component: () => HTMLElement;
}

const routes: Route[] = [
	{ path: '/', component: Home },
	{ path: '/about', component: About},
]

export function router() {
	const app = document.getElementById('app');
	if (!app) return;

	console.log('Hash:', location.hash);

	const hash = location.hash.slice(1) || '/';
	const route = routes.find(r => r.path == hash);

	app.replaceChildren(
		Navbar(),
		route ? route.component() : NotFound()
	);
}

function NotFound() : HTMLElement {
	const div = document.createElement('div');
	div.innerHTML = `<h1>404<h1><p>Page not found</p>`;
	return div;
}