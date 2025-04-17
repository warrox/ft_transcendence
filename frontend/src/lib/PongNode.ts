export abstract class PongNode<T = undefined> {
	abstract render(): string;
	protected props: T | undefined;

	constructor(props?: T) {
		this.props = props || undefined;
	}
}

export interface H1Props {
	// id: string;
	class?: string;
	children?: PongNode<any>[],
}

export class H1Node extends PongNode<H1Props> {

	constructor(props?: H1Props) {
		super(props);
	}

	render(): string {
		const childHTML = this.props?.children?.map(item => item.render()).join("") || "";
		const className = this.props?.class || "";
		// const id = this.props?.id;

		return `
			<h1 class="${className}">
				${childHTML}
			</h1>
		`;
	}
}

export class H2Node extends PongNode<H1Props> {

	constructor(props?: H1Props) {
		super(props);
	}

	render(): string {
		const childHTML = this.props?.children?.map(item => item.render()).join("") || "";
		const className = this.props?.class || "";
		// const id = this.props?.id;

		return `
			<h2 class="${className}">
				${childHTML}
			</h2>
		`;
	}
}

export interface ImgProps {
	id: string;
	// class?: string;
	src: string;
	alt?: string;
	// onClick?: () => void,
	children?: PongNode<any>[],
}

export class ImgNode extends PongNode<ImgProps> {

	constructor(props?: ImgProps) {
		super(props);
	}

	render(): string {
		// const className = this.props?.class || "";
		const src = this.props?.src || "";
		const alt = this.props?.alt || "";
		const id = this.props?.id || "";

		return `
			<img id = "${id}"
			src = "${src}"
			alt = "${alt}"/>
		`
	}
}

export interface ButtonProps {
	children?: PongNode<any>[],
	onClick?: () => void,
	id: string,
	class?: string,
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
		const className = this.props?.class || "";

		return `
			<button id="${this.props && this.props.id}"
				class="${className}">
				${childHTML}
			</button>
		`
	}
}

export interface DivProps {
	class?: string,
	children?: PongNode<any>[],
}

export class DivNode extends PongNode<DivProps> {
	render(): string {
		const childHTML = this.props?.children?.map(item => item.render()).join("") || "";
		const className = this.props?.class || "";
		return `
			<div class="${className}">
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
	class?: string;
}

export class LinkNode extends PongNode<LinkProps> {
	render():string {
		const childHTML = this.props?.children?.map(child => child.render()).join("") || "";
		const className = this.props?.class || "";

		return `
			<a href="#${this.props?.href}" class="${className}">
				${childHTML}
			</a>
		`;
	}
}

export interface PProps {
	class?: string,
	children?: PongNode<any>[],
}

export class PNode extends PongNode<PProps> {
	render(): string {
		const childHTML = this.props?.children?.map(item => item.render()).join("") || "";
		const className = this.props?.class || "";

		return `
		<p class="${className}">
		${childHTML}
		</p>
		`
	}
}

export interface InputProps {
	class?: string,
	children?: PongNode<any>[],
	type?: string,
	id: string,
	required?: boolean,
	minlength?: string,
	maxlength?: string,
	onChange?: () => void,
}

export class InputNode extends PongNode<InputProps> {

	constructor(props?: InputProps) {
		super(props);

		if (props && props.id && props.onChange) {
			this.handleOnChange(props.id, props.onChange);
		}
	}

	private handleOnChange(id: string, onChange: () => void) {
		const observer = new MutationObserver(() => {
		  const input = document.querySelector(`#${id}`);
		  if (input) {
			const clone = input.cloneNode(true) as HTMLElement;
			input.replaceWith(clone);

			clone.addEventListener('change', onChange);
			observer.disconnect();
		  }
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	render(): string {
		const {
			class: className,
			id,
			type,
			required,
			minlength,
			maxlength,
		} = this.props || {};

		return `<input
			class="${className || ""}"
			id="${id}"
			${type ? `type="${type}"` : ""}
			${required ? `required` : ""}
			${minlength ? `minlength="${minlength}"` : ""}
			${maxlength ? `maxlength="${maxlength}"` : ""}
		/>`;
	}
}
