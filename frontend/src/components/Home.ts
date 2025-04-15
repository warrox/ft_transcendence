import { PongNode } from "../lib/PongNode";
import { Div, P } from "../lib/PongFactory"


export function Home(): PongNode<any> {

	return Div({}, [
		P({}, ["Welcome to Home page !"]),
	]);
}