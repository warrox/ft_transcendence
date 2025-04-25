 import { PongNode } from '../lib/PongNode';
import { Home } from '../components/Home';
import { NotFound } from '../components/NotFound';
import { Navbar } from '../components/Navbar';
import { Register } from '../components/Register';
import { Div } from '../lib/PongFactory';
import { Login } from '../components/Login';
import { Game } from '../components/Game';
import { Landing } from '../components/Landing';
import { AuthStore } from '../stores/AuthStore';


type Route = {
	path: string;
	component: () => PongNode<any>;
	showNavbar?: boolean,
}

const routes: Route[] = [
	{ path: '/landing', component: Landing, showNavbar: false},
	{ path: '/home', component: Home },
	{ path: '/register', component: Register},
	{ path: '/login', component: Login},
	{ path: '/game', component: Game}
]

// await AuthStore.fetchMe();
// rerender();

export function renderToDOM(node: PongNode<any>, container: HTMLElement) {
	container.innerHTML = node.render();
}

export function rerender() {
	const app = document.getElementById('app');
	if (!app) return;
	
	const path = window.location.pathname || '/';
	const route = routes.find(r => r.path == path);
	const showNavbar = route?.showNavbar != false;
	
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

// export async function router() {
// 	const app = document.getElementById('app');
// 	if (!app) return;
	
// 	if (!AuthStore.user)
// 		await AuthStore.fetchMe();

// 	const path = window.location.pathname || '/';
// 	const route = routes.find(r => r.path == path);

// 	setCurrentPage(route?.component || NotFound);
// 	const showNavbar = route?.showNavbar != false;
// 	const page = route ? route.component() : NotFound();

// 	renderToDOM(
// 		Div({}, [
// 			...(showNavbar ? [Navbar()] : []),
// 			page
// 		]),
// 		app
// 	)
// }

export function navigateTo(path: string) {
	history.pushState({}, "", path);
	router(); // Re-render
}


export async function router() {
	const app = document.getElementById('app');
	if (!app) return;
	
	if (!AuthStore.user)
		await AuthStore.fetchMe();
	
	let path = window.location.pathname || '/';
	
	if (path === '/') {
		path = AuthStore.isLoggedIn ? '/home' : '/landing';
		history.replaceState({}, "", path);
	}

	const route = routes.find(r => r.path == path);

	setCurrentPage(route?.component || NotFound);
	const showNavbar = route?.showNavbar != false;
	const page = route ? route.component() : NotFound();

	renderToDOM(
		Div({}, [
			...(showNavbar ? [Navbar()] : []),
			page
		]),
		app
	)
}