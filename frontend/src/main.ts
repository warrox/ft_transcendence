// function createElem(tag: string, txt: string) : HTMLElement {
// 	const elem = document.createElement(tag);
// 	elem.textContent = txt;
// 	return elem;
// }


import { router } from './router/router';
import './types/window.d.ts';
// import './styles/index.css'
import './i18n';

window.addEventListener('DOMContentLoaded', router);
window.addEventListener('popstate', router);
// window.addEventListener('hashchange', router);