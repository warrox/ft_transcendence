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

// export function navigateTo(path: string) {
// 	const route = routes.find(r => r.path === path);
// 	if (!route) {
// 		history.pushState({}, '', '/404');
// 		setCurrentPage(() => NotFound());
// 	} else {
// 		history.pushState({}, '', path);
// 		setCurrentPage(route.component);
// 	}
// }


// function protectPath(path: any, pathString: string, isLoggedIn: boolean) {
// 	if (path === pathString && isLoggedIn)
// }


export async function router() {
	const app = document.getElementById('app');
	if (!app) return;
	
	if (!AuthStore.instance.user)
		await AuthStore.instance.fetchMe();
	
	let path = window.location.pathname || '/';

	console.log("isLoggedin ?", AuthStore.instance.isLoggedIn);
	
	
	if (path === '/') {
		path = AuthStore.instance.isLoggedIn ? '/home' : '/landing';
		history.replaceState({}, "", path);
	}

	if (path === '/home' && !AuthStore.instance.isLoggedIn) {
		path = '/landing';
		history.replaceState({}, "", path);
	}


	if (path === '/game' && !AuthStore.instance.isLoggedIn) {
		path = '/landing';
		history.replaceState({}, "", path);
	}

	if ((path === '/register' || path === '/login') && AuthStore.instance.isLoggedIn) {
		path = '/home';
		history.replaceState({}, "" , path)
	}

	if (path === '/profil' && !AuthStore.instance.isLoggedIn) {
		path = '/landing';
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