import { DivNode, ButtonNode, TextNode, DivProps, PongNode, ButtonProps, LinkNode, LinkProps, PNode, PProps } from "./PongNode";

export function Div(props?: DivProps, child?: Array<PongNode<any> | string>): DivNode {
	const coercedChildren = child && child.map(item => coerceChild(item)) || undefined;
	return new DivNode({ ...props, children: coercedChildren });
}

export function Button(props?: ButtonProps, child?: Array<PongNode<any> | string>): ButtonNode {
	const coercedChildren = child && child.map(item => coerceChild(item)) || undefined;
	return new ButtonNode({ ...props, children: coercedChildren });
}

export function P(props?: PProps, child?: Array<PongNode<any> | string>): PNode {
	const coercedChildren = child && child.map(item => coerceChild(item)) || undefined;
	return new PNode({ ...props, children: coercedChildren });
}

export function Link(props: LinkProps, child?: Array<PongNode<any> | string>): LinkNode {
	const coercedChildren = child?.map(coerceChild);
	return new LinkNode({ ...props, children: coercedChildren });
}

function coerceChild(child: PongNode<any> | string): PongNode<any> {
	if (typeof child === "string") {
		return new TextNode(child);
	}
	return child;
}