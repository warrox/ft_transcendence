import { DivNode, ButtonNode, TextNode, DivProps, PongNode, ButtonProps, LinkNode, LinkProps, PNode, PProps, InputNode, InputProps, ImgNode, ImgProps, H1Props, H1Node, H2Node, LiProps, LiNode, UListProps, UListNode, SpanProps, SpanNode, RawNode } from "./PongNode";

export function Span(props: SpanProps, child?: Array<PongNode<any> | string>): SpanNode {
	const coerceChildren = child?.map(coerceChild);
	return new SpanNode ({...props, children: coerceChildren});
}

export function Li(props: LiProps, child?: Array<PongNode<any> | string>): LiNode {
	const coerceChildren = child?.map(coerceChild);
	return new LiNode ({...props, children: coerceChildren });
}

export function UList(props: UListProps, child?: Array<PongNode<any> | string>): UListNode {
	const coerceChildren = child?.map(coerceChild);
	return new UListNode ({...props, children: coerceChildren });
}

export function H2(props: H1Props, child?: Array<PongNode<any> | string>): H2Node {
	const coerceChildren = child?.map(coerceChild);
	return new H2Node ({...props, children: coerceChildren });
}

export function H1(props: H1Props, child?: Array<PongNode<any> | string>): H1Node {
	const coerceChildren = child?.map(coerceChild);
	return new H1Node ({...props, children: coerceChildren });
}

export function Image(props: ImgProps, child?: Array<PongNode<any> | string>): ImgNode {
	const coerceChildren = child?.map(coerceChild);
	return new ImgNode ({...props, children: coerceChildren });
}

export function Div(props?: DivProps, child?: Array<PongNode<any> | string>): DivNode {
	const coercedChildren = child?.map(coerceChild);
	return new DivNode({ ...props, children: coercedChildren });
}

export function Button(props: ButtonProps, child?: Array<PongNode<any> | string>): ButtonNode {
	const coercedChildren = child?.map(coerceChild);
	return new ButtonNode({ ...props, children: coercedChildren });
}

export function P(props?: PProps, child?: Array<PongNode<any> | string>): PNode {
	const coercedChildren = child?.map(coerceChild);
	return new PNode({ ...props, children: coercedChildren });
}

export function Link(props: LinkProps, child?: Array<PongNode<any> | string>): LinkNode {
	const coercedChildren = child?.map(coerceChild);
	return new LinkNode({ ...props, children: coercedChildren });
}

export function Input(props: InputProps, child?: Array<PongNode<any> | string>): InputNode {
	const coercedChildren = child?.map(coerceChild);
	return new InputNode({ ...props, children: coercedChildren });
}

export function RawHTML(html: string): PongNode<any> {
	return new RawNode({ html });
}
function coerceChild(child: PongNode<any> | string): PongNode<any> {
	if (typeof child === "string") {
		return new TextNode(child);
	}
	return child;
}
