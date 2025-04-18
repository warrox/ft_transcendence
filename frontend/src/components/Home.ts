import { PongNode } from "../lib/PongNode";
import { Div, P, Button } from "../lib/PongFactory"

export function Home(): PongNode<any> {

	const body = {
		// name: "test2",
		// surname: "test2eeee",
		email: "test2@gmail.com",
		password: "jspppffff"
	};

	const sendBody = () => {
		fetch("http://localhost:3000/login", {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			}
		})
		.then(res => {
			if (!res.ok)
				throw new Error(`HTTP error! Status: ${res.status}`);
			return res.text();
		})
		.then(body => {
			console.log("res brute :", body);
			try {
			  const parsedBody = JSON.parse(body);
			  console.log("Body parsed:", parsedBody);
			} catch (e) {
			  console.error("Erreur de parsing JSON :", e);
			}
		})
		.catch(e => console.error("Erreur :", e));
	}


	return Div({}, [
		P({}, ["Welcome to Home page !"]),
		Button({id: "b2", onClick: sendBody, class: "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" }, ["Login test"]),
		
	]);
}