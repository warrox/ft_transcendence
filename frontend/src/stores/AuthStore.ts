export const AuthStore = {
	isLoggedIn: false,
	user: null as null | { username: string },
	async fetchMe(): Promise<void> {
		try {
			const res = await fetch("/api/me", {
				credentials: "include",
			});
			if (res.ok) {
				console.log("LOG")
				this.user = await res.json();
				this.isLoggedIn = true;
			} else {
				console.log("nop");
				
				this.user = null;
				this.isLoggedIn = false;
			}
		} catch (err) {
			this.user = null;
			this.isLoggedIn = false;
		}
	}
};
