// function createElem(tag: string, txt: string) : HTMLElement {
// 	const elem = document.createElement(tag);
// 	elem.textContent = txt;
// 	return elem;
// }

// function startApp() {
// 	const app = document.getElementById('app');

// 	if (!app) return;

// 	const title = createElem('h1', 'Welcome !');
// 	const paragraph = createElem('p', 'Ty');
// 	const button = createElem('button', 'click');

// 	button.addEventListener('click' ,() => {
// 		paragraph.textContent = 'Well done';
// 		console.log('ici');
// 	});

// 	app.append(title, paragraph, button);
// }

// document.addEventListener('DOMContentLoaded', startApp);


import { Home } from './components/Home'

function startApp() {
	const app = document.getElementById('app');
	if (!app) return;

	app.innerHTML = ''; // On nettoie avant d'afficher
	app.append(Home()); // On ajoute la page Home
}

document.addEventListener('DOMContentLoaded', startApp);