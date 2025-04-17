 import { PongNode } from '../lib/PongNode';
import { Home } from '../components/Home';
import { NotFound } from '../components/NotFound';
import { About } from '../components/About';
import { Navbar } from '../components/Navbar';
import { Register } from '../components/Register';
import { Div } from '../lib/PongFactory';


type Route = {
	path: string;
	component: () => PongNode<any>;
}

const routes: Route[] = [
	{ path: '/', component: Home },
	{ path: '/about', component: About},
	{ path: '/register', component: Register}
]

export function renderToDOM(node: PongNode<any>, container: HTMLElement) {
	container.innerHTML = node.render();
}

export function rerender() {
	const app = document.getElementById('app');
	if (!app) return;

	const pageNode = currentPage();

	renderToDOM(
		Div({}, [
			Navbar(),
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

	const page = route ? route.component() : NotFound();

	renderToDOM(
		Div({}, [
			Navbar(),
			page
		]),
		app
	);
}
