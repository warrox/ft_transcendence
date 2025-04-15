import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";
import { Div, P, Button } from "../lib/PongFactory";

let postData: null | { title: string; body: string } = null;


export function About(): PongNode<any> {
	const handleClick = () => {
			fetch('https://jsonplaceholder.typicode.com/posts/1')
			.then(res => res.json())
			.then(data => postData = data)
			.finally(() => rerender())
		}
	
		const handleHide = () => {
			postData = null;
			rerender();
		};

		return Div({}, [
			P({}, ["Welcome to About page !"]),
			Button({ id: "b1", onClick: handleClick }, ["Get a random activity"]),
			P({}, [
				postData && postData.title || ""
			]),
			Button({id: "b2", onClick: handleHide }, ["Hide title"]),
		])
}