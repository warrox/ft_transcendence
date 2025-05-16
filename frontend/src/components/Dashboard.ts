import { Div, P, Button, Input, Span, Li, UList } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";
import { navigateTo } from "../router/router";
import { AuthStore } from "../stores/AuthStore";
import "../styles/index.css";
import { t } from "i18next";
import i18n from "i18next";

let loginStatus: null | "OK" | "KO" = null;

let registerState: "idle" | "success" | "error" = "idle";

//export function


