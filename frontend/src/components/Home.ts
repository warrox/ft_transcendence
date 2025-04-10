// function createElem(tag: string, txt: string) : HTMLElement {
// 	const elem = document.createElement(tag);
// 	elem.textContent = txt;
// 	return elem;
// }


export function Home(): HTMLElement {
	const container = document.createElement('div');
	container.classList.add('home');

	const title = document.createElement('h1');
	title.textContent = 'Welcome to Home Page';

	const description = document.createElement('p');
	description.textContent = 'This is a single page app.';


	const button = document.createElement('button');
	button.textContent = 'Click me';
	button.addEventListener('click', () => {
		description.textContent = 'Clicked!';
	});

	container.append(title, description, button);
	return container;
}