import { PongNode } from "../lib/PongNode";
import { Div, P } from "../lib/PongFactory";

export function NotFound() : PongNode<any> {
	return Div({}, [
		P({}, ["404 - Page not found"])
	]);
}
