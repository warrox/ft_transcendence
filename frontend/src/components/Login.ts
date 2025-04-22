import { Div, P, Button, Input, Span, Li, UList } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";
import {
	backgroundCss,
	fancyButtonCss,
	fancyLeftBorderCss,
	fancyRightBorderCss,
	disappearingTextCss,
	appearingTextCss,
	loginWrapperCss,
	loginCardCss,
	headerCss,
	neonTextCss,
	inputWrapperCss,
	statusWrapperCss,
	statusKoCss,
	statusOkCss,
	inputScaleCss,
	areaCss,
	circlesCss,
	circle1Css,
	circle2Css,
	circle3Css,
	circle4Css,
	circle5Css,
	circle6Css,
	circle7Css,
	circle8Css,
	circle9Css,
	circle10Css
} from "../styles/cssFactory";

import "../styles/index.css";

let loginStatus: null | "OK" | "KO" = null;

export function Login(): PongNode<any> {
    const emailInput = Input({ 
        id: "emailInput", 
        required: true, 
        onChange: () => {},
        class: inputScaleCss,
    });
    const passwordInput = Input({
        id: "password",
        type: "password",
        required: true,
        onChange: () => {},
        class: inputScaleCss,
    });

    const handleLogin = () => {
        const email = (document.querySelector("#emailInput") as HTMLInputElement)?.value;
        const password = (document.querySelector("#password") as HTMLInputElement)?.value;

        const body = {
            email,
            password,
        };

        fetch("http://localhost:3000/login", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(async res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const text = await res.text();
            console.log("Réponse brute du serveur :", text);

            try {
                const parseBody = JSON.parse(text);
                console.log("Response parsed from JSON :", parseBody);
                loginStatus = parseBody.success === true ? "OK" : "KO";
            } catch (e) {
                console.log("Error parsing JSON: ", e);
                loginStatus = "KO";
            }
        })
        .catch(e => {
            console.log("Error while requesting:" , e);
            loginStatus = "KO";
        })
        .finally(() => {
            rerender();
        });
    };

    return Div({ class: areaCss }, [
        UList({ class: circlesCss }, [
            Li({ class: circle1Css }),
            Li({ class: circle2Css }),
            Li({ class: circle3Css }),
            Li({ class: circle4Css }),
            Li({ class: circle5Css }),
            Li({ class: circle6Css }),
            Li({ class: circle7Css }),
            Li({ class: circle8Css }),
            Li({ class: circle9Css }),
            Li({ class: circle10Css }),
        ]),
        Div({ class: `${loginWrapperCss} ${backgroundCss}` }, [
            Div({ class: loginCardCss }, [
                Div({ class: headerCss }, [
                    P({ class: neonTextCss }, ["Login Page"]),
                ]),
                Div({ class: inputWrapperCss }, [
                    emailInput,
                    passwordInput,
                ]),
                Button({
                    id: "button1",
                    onClick: handleLogin,
                    class: fancyButtonCss,
                }, [
                    Div({ class: fancyLeftBorderCss }),
                    P({ class: disappearingTextCss }, ["Click here"]),
                    Span({ class: appearingTextCss }, ["Login"]),
                    Div({ class: fancyRightBorderCss }),
                ]),
                ...(loginStatus !== null
                    ? [Div({ class: statusWrapperCss }, [
                        P({ class: loginStatus === "OK" ? statusOkCss : statusKoCss }, [`Login status: ${loginStatus}`])
                    ])]
                    : [])
            ])
        ])
    ]);
}
