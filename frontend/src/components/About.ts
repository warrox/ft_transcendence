export function About(): HTMLElement {
	const div = document.createElement('div');
	div.innerHTML = `
		<h1>About</h1>
		<p>Ceci est une SPA sans React 🧙‍♂️</p>
	`;
	return div;
}