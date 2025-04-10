abstract class PongNode<T = undefined> {
	abstract render(): string;
	protected props: T | undefined;

	constructor(props?: T) {
		this.props = props || undefined;
	}
}

interface ButtonProps {
	children?: PongNode<any>,
	onClick?: () => void,
	id: string,
}

export class Button extends PongNode<ButtonProps> {

	constructor(props?: ButtonProps) {
		super(props);

		if (props && props.onClick) {
			this.handleOnClick(props.id, props.onClick);
		}
	}

	private handleOnClick(id: string, onClick: () => void) {
		const observer = new MutationObserver(() => {
		  const button = document.querySelector(`#${id}`);
		  if (button) {
			button.addEventListener('click', onClick);
			observer.disconnect();
		  }
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	render(): string {
		return `
			<button id="${this.props && this.props.id}">
				${this.props && this.props.children ? this.props.children.render() : ""}
			</button>
		`
	}
}

interface DivProps {
	style?: string,
	children?: PongNode<any>,
}

export class Div extends PongNode<DivProps> {
	render(): string {
		return `
			<div id="Div" class="${this.props && this.props.style || ""}">
				${this.props && this.props.children ? this.props.children.render() : ""}
			</div>
		`
	}
}