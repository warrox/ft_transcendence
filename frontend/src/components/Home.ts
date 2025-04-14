import { PongNode } from "../lib/PongNode";
import { Button, Div, P } from "../lib/PongFactory"
import { rerender } from "../router/router";

// function createElem(tag: string, txt: string) : HTMLElement {
// 	const elem = document.createElement(tag);
// 	elem.textContent = txt;
// 	return elem;
// }

let postData: null | { title: string; body: string } = null;

export function Home(): PongNode<any> {
	
	// const data: 

	// postData = { title: data.title, body: data.body };
	const handleClick = () => {
		// console.log("test");
		fetch('https://jsonplaceholder.typicode.com/posts/1')
		.then(res => res.json())
		.then(data => postData = data)
		.finally(() => rerender())
	}

	const handleHide = () => {
		postData = null;
		rerender();
	};

	console.log(postData);
	

	return Div({}, [
		P({}, ["Welcome to Home page !"]),
		Button({ id: "b1", onClick: handleClick }, ["Get a random activity"]),
		P({}, [
			postData && postData.title || ""
		]),
		Button({id: "b2", onClick: handleHide }, ["Hide title"]),
	]);
}