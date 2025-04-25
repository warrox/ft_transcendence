export {};

declare global {
	interface Window {
		google: typeof google.accounts;
		onSignIn: (response: any) => void;
	}
}
