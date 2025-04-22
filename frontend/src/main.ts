// function createElem(tag: string, txt: string) : HTMLElement {
// 	const elem = document.createElement(tag);
// 	elem.textContent = txt;
// 	return elem;
// }


import { router } from './router/router';
import './types/window.d.ts';
import './styles/index.css'


window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);