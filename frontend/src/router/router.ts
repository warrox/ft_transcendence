 import { PongNode } from '../lib/PongNode';
import { Home } from '../components/Home';
import { NotFound } from '../components/NotFound';
import { Navbar } from '../components/Navbar';
import { Register } from '../components/Register';
import { Div } from '../lib/PongFactory';
import { Login } from '../components/Login';
import { Game } from '../components/Game';
import { Tournament } from '../components/Tournament';
import { Landing } from '../components/Landing';
import { Profil } from '../components/Profil'
import { AuthStore } from '../stores/AuthStore';
import { Dashboard } from '../components/Dashboard'


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
	{ path: '/game', component: Game},
	{ path: '/profil', component: Profil},
	{ path: '/tournament', component: Tournament},
	{ path: '/dashboard', component: Dashboard},
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

	// console.log("path = ", path);
	// if (path === '/game' && !AuthStore.isLoggedIn) {
	// 	history.pushState(({}), "", '/login');
	// 	router();
	// 	return;
	// }

	history.pushState({}, "", path);
	router();
}

// function protectPath(path: any, pathString: string, isLoggedIn: boolean) {
// 	if (path === pathString && isLoggedIn)
// }


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

	if (path === '/home' && !AuthStore.isLoggedIn) {
		path = '/landing';
		history.replaceState({}, "", path);
	}

	if (path === '/game' && !AuthStore.isLoggedIn) {
		path = '/landing';
		history.replaceState({}, "", path);
	}

	if ((path === '/register' || path === '/login') && AuthStore.isLoggedIn) {
		path = '/home';
		history.replaceState({}, "" , path)
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