export abstract class PongNode<T = undefined> {
	abstract render(): string;
	protected props: T | undefined;

	constructor(props?: T) {
		this.props = props || undefined;
	}
}

export interface ButtonProps {
	children?: PongNode<any>[],
	onClick?: () => void,
	id?: string,
}

export class ButtonNode extends PongNode<ButtonProps> {

	constructor(props?: ButtonProps) {
		super(props);

		if (props && props.id && props.onClick) {
			this.handleOnClick(props.id, props.onClick);
		}
	}

	private handleOnClick(id: string, onClick: () => void) {
		const observer = new MutationObserver(() => {
		  const button = document.querySelector(`#${id}`);
		  if (button) {
			const clone = button.cloneNode(true) as HTMLElement;
			button.replaceWith(clone);

			clone.addEventListener('click', onClick);
			observer.disconnect();
		  }
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	render(): string {
		const childHTML = this.props?.children?.map(item => item.render()).join("") || "";

		return `
			<button id="${this.props && this.props.id}">
				${childHTML}
			</button>
		`
	}
}

export interface DivProps {
	style?: string,
	children?: PongNode<any>[],
}

export class DivNode extends PongNode<DivProps> {
	render(): string {
		const childHTML = this.props?.children?.map(item => item.render()).join("") || "";

		return `
			<div class="${this.props && this.props.style || ""}">
				${childHTML}
			</div>
		`
	}
}

export class TextNode extends PongNode<undefined> {
	constructor(private text: string) {
		super();
	}

	render(): string {
		return this.text;
	}
}

export interface LinkProps {
	href: string;
	children?: PongNode<any>[];
	style?: string;
}

export class LinkNode extends PongNode<LinkProps> {
	render():string {
		const childHTML = this.props?.children?.map(child => child.render()).join("") || "";
		return `
			<a href="#${this.props?.href}" class="${this.props?.style || ""}">
				${childHTML}
			</a>
		`;
	}
}

export interface PProps {
	style?: string,
	children?: PongNode<any>[],
}

export class PNode extends PongNode<PProps> {
	render(): string {
		const childHTML = this.props?.children?.map(item => item.render()).join("") || "";

		return `
			<p class="${this.props && this.props.style || ""}">
				${childHTML}
			</p>
		`
	}
}