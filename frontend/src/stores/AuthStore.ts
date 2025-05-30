// src/stores/AuthStore.ts
export type User = {
  id: string;
  is_2FA: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  avatar_path: string;
};

type Subscriber = () => void;

export class AuthStore {
	private static _instance: AuthStore;
	private subscribers: Subscriber[] = [];

	public user: User | null = null;
	public isLoggedIn = false;

	private constructor() {}

	public static get instance(): AuthStore {
		if (!AuthStore._instance) {
			AuthStore._instance = new AuthStore();
		}
		return AuthStore._instance;
	}

	public subscribe(fn: Subscriber) {
		this.subscribers.push(fn);
	}

	private notify() {
		for (const fn of this.subscribers) {
			fn();
		}
	}

	public async fetchMe(): Promise<void> {
		try {
			const res = await fetch("/api/me", {
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			});
	
			if (!res.ok) {
				if (this.user !== null || this.isLoggedIn !== false) {
					this.user = null;
					this.isLoggedIn = false;
					this.notify();
				}
				return;
			}
	
			const newUser = await res.json();
	
			if (
				JSON.stringify(this.user) !== JSON.stringify(newUser) ||
				this.isLoggedIn !== true
			) {
				this.user = newUser;
				this.isLoggedIn = true;
				this.notify();
			}
		} catch (e) {
			console.error("Erreur fetchMe:", e);
			if (this.user !== null || this.isLoggedIn !== false) {
				this.user = null;
				this.isLoggedIn = false;
				this.notify();
			}
		}
	}
	
	public async refresh(): Promise<void> {
		await this.fetchMe();
	}

	public resetAuthState() {
		this.user = null;
		this.isLoggedIn = false;
		this.notify();
	}
}
