export function Navbar(): HTMLElement {
	const nav = document.createElement('nav');
	nav.classList.add('navbar');

	nav.innerHTML = `
		<ul style="display: flex; gap: 1rem; list-style: none; padding: 0;">
			<li><a href="#/">Home</a></li>
			<li><a href="#/about">About</a></li>
		</ul>
	`;

	return nav;
}