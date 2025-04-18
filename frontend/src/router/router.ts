 import { PongNode } from '../lib/PongNode';
import { Home } from '../components/Home';
import { NotFound } from '../components/NotFound';
import { About } from '../components/About';
import { Navbar } from '../components/Navbar';
import { Register } from '../components/Register';
import { Div } from '../lib/PongFactory';
import { Login } from '../components/Login';
import { Game } from '../components/Game';
import { Landing } from '../components/Landing';

type Route = {
	path: string;
	component: () => PongNode<any>;
	showNavbar?: boolean,
}

const routes: Route[] = [
	{ path: '/', component: Landing, showNavbar: false},
	{ path: '/home', component: Home },
	{ path: '/about', component: About},
	{ path: '/register', component: Register},
	{ path: '/login', component: Login},
	{ path: '/game', component: Game}
]

export function renderToDOM(node: PongNode<any>, container: HTMLElement) {
	container.innerHTML = node.render();
}

export function rerender() {
	const app = document.getElementById('app');
	if (!app) return;

	const hash = location.hash.slice(1) || '/';
	const route = routes.find(r => r.path === hash);
	const showNavbar = route?.showNavbar !== false;
	
	const pageNode = currentPage();
	renderToDOM(
		Div({}, [
			...(showNavbar ? [Navbar()] : []),
			pageNode,
		]),
		app
	);
}

let currentPage: () => PongNode<any> = () => NotFound();

export function setCurrentPage(page: () => PongNode<any>) {
	currentPage = page;
	rerender();
}

export function router() {
	const app = document.getElementById('app');
	if (!app) return;

	console.log('Hash:', location.hash);

	const hash = location.hash.slice(1) || '/';
	const route = routes.find(r => r.path == hash);

	setCurrentPage(route?.component || NotFound);
	const showNavbar = route?.showNavbar !== false;
	const page = route ? route.component() : NotFound();

	renderToDOM(
		Div({}, [
			...(showNavbar ? [Navbar()] : []),
			page
		]),
		app
	);
}
